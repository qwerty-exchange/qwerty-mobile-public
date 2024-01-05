import { QMarketType } from '../constants/enum';
import { useApi } from '../contexts/api';
import { UiBridgeTransformer2 } from '../transformers/UiBridgeTransformer';
import { UiExplorerTransformer } from '../transformers/UiExplorerTransformer';

import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import {
  DerivativeLimitOrder,
  DerivativeMarket,
  PerpetualMarket,
  Position,
  SpotLimitOrder,
  SpotMarket,
  SpotTrade,
  TradeExecutionSide,
} from '@injectivelabs/sdk-ts';
import { TokenService, UiBridgeTransformer } from '@injectivelabs/sdk-ui-ts';
import { ChainId } from '@injectivelabs/ts-types';
import { BigNumberInBase } from '@injectivelabs/utils';

import { UseQueryOptions, UseQueryResult, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { parseJSON } from 'date-fns';

import { useAccount } from '@contexts/account';
import { getCurrentTime } from '@tools/getCurrentTime';

export const tokenService = new TokenService({
  chainId: ChainId.Mainnet,
  network: Network.Mainnet,
  endpoints: getNetworkEndpoints(Network.Mainnet),
});

const uiBridgeTransformer = new UiBridgeTransformer(Network.Mainnet);

export function useOrderBooks(marketId: string, marketType: QMarketType) {
  const { indexerGrpcSpotApi, indexerGrpcDerivativesApi } = useApi();
  return useQuery({
    queryKey: ['order-book', marketId, marketType],
    queryFn: () =>
      marketType === QMarketType.SPOT
        ? indexerGrpcSpotApi.fetchOrderbookV2(marketId)
        : indexerGrpcDerivativesApi.fetchOrderbookV2(marketId),
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

export function useTrades(marketId: string, marketType: QMarketType) {
  const { indexerGrpcSpotApi, indexerGrpcDerivativesApi } = useApi();
  return useQuery({
    queryKey: ['trades', marketId, marketType],
    queryFn: async () => {
      const requestArgs = {
        marketId,
        executionSide: TradeExecutionSide.Taker,
        pagination: { limit: 100 },
      };

      const result = await (marketType === QMarketType.SPOT
        ? indexerGrpcSpotApi.fetchTrades(requestArgs)
        : indexerGrpcDerivativesApi.fetchTrades(requestArgs));

      return result.trades as SpotTrade[];
    },
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

export const useMarkets = (select?) =>
  useQuery({
    queryKey: ['markets'],
    queryFn: () =>
      fetch('http://qwerty.bmb9d5fpc5h5cmez.westeurope.azurecontainer.io/v1/markets').then((res) =>
        res.json()
      ),
    select,
    refetchInterval: 2000,
    staleTime: 1000,
  });

export const useMarketSummary = (marketId: string) =>
  useMarkets(
    (data) =>
      data.spot.find((x) => x.id === marketId) || data.derivative.find((x) => x.id === marketId)
  );

export function useMarketsMetadata<TResult = SpotMarket | DerivativeMarket[]>(
  options?: UseQueryOptions<(SpotMarket | DerivativeMarket)[], unknown, TResult>
) {
  const { indexerGrpcSpotApi, indexerGrpcDerivativesApi } = useApi();
  return useQuery({
    queryKey: ['market-metadata'],
    staleTime: Infinity,
    queryFn: async () => {
      const spotMarket = await indexerGrpcSpotApi.fetchMarkets();
      const derivativeMarket = await indexerGrpcDerivativesApi.fetchMarkets();
      return [...spotMarket, ...derivativeMarket];
    },
    ...options,
  });
}

export const useMarketMetadata = (marketId: string) =>
  useMarketsMetadata({ select: (data) => data.find((x) => x.marketId === marketId) });

export function useFundingRate(marketId: string) {
  const { indexerGrpcDerivativesApi } = useApi();
  return useQuery({
    queryKey: ['funding-rates', marketId],
    refetchInterval: 60000,
    staleTime: 60000,
    queryFn: async () => {
      const response = (await indexerGrpcDerivativesApi.fetchMarket(marketId)) as PerpetualMarket;

      const now = getCurrentTime();
      const divisor = new BigNumberInBase(now).mod(3600).times(24);

      const tWaspEst = new BigNumberInBase(
        response.perpetualMarketFunding.cumulativePrice
      ).dividedBy(divisor);

      const hourlyFundingRateCap = new BigNumberInBase(
        response.perpetualMarketInfo.hourlyFundingRateCap
      );
      const estFundingRate = new BigNumberInBase(
        response.perpetualMarketInfo.hourlyInterestRate
      ).plus(tWaspEst);

      if (estFundingRate.gt(hourlyFundingRateCap)) {
        return {
          fundingRate: new BigNumberInBase(hourlyFundingRateCap).multipliedBy(100),
          nextFundingTimestamp: response.perpetualMarketInfo.nextFundingTimestamp,
        };
      }

      if (estFundingRate.lt(hourlyFundingRateCap.times(-1))) {
        return {
          fundingRate: new BigNumberInBase(hourlyFundingRateCap).times(-1).multipliedBy(100),
          nextFundingTimestamp: response.perpetualMarketInfo.nextFundingTimestamp,
        };
      }

      return {
        fundingRate: new BigNumberInBase(estFundingRate).multipliedBy(100),
        nextFundingTimestamp: response.perpetualMarketInfo.nextFundingTimestamp,
      };
    },
  });
}

export const useUserAccountBalance = (select?) => {
  const { injectiveAddress: injAddress } = useAccount();
  return useQuery({
    queryKey: ['balance', injAddress],
    enabled: !!injAddress,
    queryFn: async () => {
      const response = await fetch(
        `http://qwerty.bmb9d5fpc5h5cmez.westeurope.azurecontainer.io/v1/accounts/${injAddress}/balance`
      );
      if (response.status !== 200) {
        throw new Error('Something went wrong');
      }

      return await response.json();
    },
    select,
    refetchInterval: 2000,
    staleTime: 1000,
  });
};

export function useUserActiveOrders(
  marketType: typeof QMarketType.SPOT,
  options?: UseQueryOptions
): UseQueryResult<SpotLimitOrder[]>;
export function useUserActiveOrders(
  marketType: typeof QMarketType.DERIVATIVE,
  options?: UseQueryOptions
): UseQueryResult<DerivativeLimitOrder[]>;
export function useUserActiveOrders(
  marketType: QMarketType,
  options?: UseQueryOptions
): UseQueryResult<SpotLimitOrder[] | DerivativeLimitOrder[]>;
export function useUserActiveOrders(marketType: QMarketType, options?: UseQueryOptions) {
  const { indexerGrpcSpotApi, indexerGrpcDerivativesApi } = useApi();
  const { subaccountId } = useAccount();

  return useQuery({
    queryKey: ['orders-active', subaccountId, marketType],
    ...options,
    refetchInterval: 5000,
    staleTime: 3000,
    queryFn: async () => {
      const requestArgs = {
        subaccountId,
      };

      const response = await (marketType === QMarketType.SPOT
        ? indexerGrpcSpotApi.fetchOrders(requestArgs)
        : indexerGrpcDerivativesApi.fetchOrders(requestArgs));

      return response.orders;
    },
  });
}

export function useUserDerivativePositions<TResult = Position[]>(
  options?: UseQueryOptions<Position[], unknown, TResult>
) {
  const { indexerGrpcDerivativesApi } = useApi();
  const { subaccountId } = useAccount();
  return useQuery({
    queryKey: ['market-derivative-positions'],
    refetchInterval: 5000,
    staleTime: 3000,
    queryFn: async () => {
      const response = await indexerGrpcDerivativesApi.fetchPositions({
        subaccountId,
      });
      return response.positions;
    },
    ...options,
  });
}

export function useUserOrderHistory(marketType: QMarketType) {
  const { indexerGrpcSpotApi, indexerGrpcDerivativesApi } = useApi();
  const { subaccountId } = useAccount();
  return useInfiniteQuery({
    queryKey: ['order-history', marketType, subaccountId],
    refetchInterval: 50000,
    staleTime: 30000,
    queryFn: async ({ pageParam = 0 }) => {
      const requestArgs = {
        subaccountId,
        pagination: { countTotal: true, limit: 5, skip: pageParam },
      };

      const orders = await (marketType === QMarketType.SPOT
        ? indexerGrpcSpotApi.fetchOrderHistory(requestArgs)
        : indexerGrpcDerivativesApi.fetchOrderHistory(requestArgs));

      return orders;
    },
    getNextPageParam: (lastPage, allPages) =>
      allPages.reduce((a, b) => a + b.orderHistory.length, 0),
  });
}
export function useUserTradeHistory(marketType: QMarketType) {
  const { indexerGrpcSpotApi, indexerGrpcDerivativesApi } = useApi();
  const { subaccountId } = useAccount();
  return useInfiniteQuery({
    queryKey: ['trade-history', marketType, subaccountId],
    refetchInterval: 50000,
    staleTime: 30000,
    queryFn: async ({ pageParam = 0 }) => {
      const requestArgs = {
        subaccountId,
        pagination: { countTotal: true, limit: 5, skip: pageParam },
      };

      const trades = await (marketType === QMarketType.SPOT
        ? indexerGrpcSpotApi.fetchTrades(requestArgs)
        : indexerGrpcDerivativesApi.fetchTrades(requestArgs));

      return trades;
    },
    getNextPageParam: (lastPage, allPages) => allPages.reduce((a, b) => a + b.trades.length, 0),
  });
}
export function useUserFundingPaymentHistory() {
  const { indexerGrpcDerivativesApi } = useApi();
  const { subaccountId } = useAccount();
  return useInfiniteQuery({
    queryKey: ['funding-payment', subaccountId],
    refetchInterval: 50000,
    staleTime: 30000,
    queryFn: async ({ pageParam = 0 }) => {
      const funding = indexerGrpcDerivativesApi.fetchFundingPayments({
        subaccountId,
        pagination: { countTotal: true, limit: 5, skip: pageParam },
      });

      return funding;
    },
    getNextPageParam: (lastPage, allPages) =>
      allPages.reduce((a, b) => a + b.fundingPayments.length, 0),
  });
}

export function useUserDepositHistory() {
  const { indexerGrpcExplorerApi } = useApi();
  const { injectiveAddress } = useAccount();

  return useQuery({
    queryKey: ['deposit', injectiveAddress],
    refetchInterval: 50000,
    staleTime: 30000,
    queryFn: async () => {
      const peggyTxs$ = indexerGrpcExplorerApi.fetchPeggyDepositTxs({
        receiver: injectiveAddress,
      });

      const injTxs$ = indexerGrpcExplorerApi.fetchAccountTx({
        address: injectiveAddress,
        limit: -1,
        type: 'cosmos.bank.v1beta1.MsgSend',
      });

      const ibcTxs$ = indexerGrpcExplorerApi.fetchIBCTransferTxs({
        receiver: injectiveAddress,
      });

      const [peggyTxs, injTxs, ibcTxs] = await Promise.all([peggyTxs$, injTxs$, ibcTxs$]);

      const peggyBridgeTransactions = await Promise.all(
        peggyTxs.map(
          async (transaction) =>
            await uiBridgeTransformer.convertPeggyDepositTxToUiBridgeTransaction(transaction)
        )
      );

      const ibcBridgeTransactions = await Promise.all(
        ibcTxs.map(
          async (transaction) =>
            await uiBridgeTransformer.convertIBCTransferTxToUiBridgeTransaction({
              ...transaction,
              createdAt: parseJSON(transaction.createdAt).toISOString(),
            })
        )
      );

      const injBridgeTransactions = (injTxs.txs || [])
        .filter((tx) => tx.messages)
        .map(UiExplorerTransformer.transactionMessageToBankMsgSendTransaction)
        .filter((tx) => tx.amount)
        .map(UiBridgeTransformer2.convertBankMsgSendTransactionToUiBridgeTransaction);

      const transactions = UiBridgeTransformer.mergeAllTransactions({
        peggyDepositBridgeTransactions: peggyBridgeTransactions,
        ibcTransferBridgeTransactions: ibcBridgeTransactions,
        latestTransactions: injBridgeTransactions,
      }).filter((tx) => tx.receiver === injectiveAddress);

      const uiBridgeTransactionsWithToken = await tokenService.toBridgeTransactionsWithToken(
        transactions
      );
      return uiBridgeTransactionsWithToken.sort((a, b) => b.timestamp - a.timestamp);
    },
  });
}
export function useUserWithdrawalHistory() {
  const { indexerGrpcExplorerApi } = useApi();
  const { injectiveAddress } = useAccount();
  return useQuery({
    queryKey: ['withdrawal', injectiveAddress],
    refetchInterval: 50000,
    staleTime: 30000,
    queryFn: async () => {
      const peggyTxs$ = indexerGrpcExplorerApi.fetchPeggyWithdrawalTxs({
        sender: injectiveAddress,
      });

      const injTxs$ = indexerGrpcExplorerApi.fetchAccountTx({
        address: injectiveAddress,
        limit: -1,
        type: 'cosmos.bank.v1beta1.MsgSend',
      });

      const ibcTxs$ = indexerGrpcExplorerApi.fetchIBCTransferTxs({
        sender: injectiveAddress,
      });

      const [peggyTxs, injTxs, ibcTxs] = await Promise.all([peggyTxs$, injTxs$, ibcTxs$]);

      const peggyBridgeTransactions = await Promise.all(
        peggyTxs.map(
          async (transaction) =>
            await uiBridgeTransformer.convertPeggyDepositTxToUiBridgeTransaction(transaction)
        )
      );

      const ibcBridgeTransactions = UiBridgeTransformer.removeDuplicatedInProgressIbxTransfers(
        (await Promise.all(
          ibcTxs.map(
            async (transaction) =>
              await uiBridgeTransformer.convertIBCTransferTxToUiBridgeTransaction({
                ...transaction,
                createdAt: parseJSON(transaction.createdAt).toISOString(),
              })
          )
        )) as any
      );

      const injBridgeTransactions = (injTxs.txs || [])
        .filter((tx) => tx.messages)
        .map(UiExplorerTransformer.transactionMessageToBankMsgSendTransaction)
        .filter((tx) => tx.amount)
        .map(UiBridgeTransformer2.convertBankMsgSendTransactionToUiBridgeTransaction);

      const transactions = UiBridgeTransformer.mergeAllTransactions({
        peggyDepositBridgeTransactions: peggyBridgeTransactions,
        ibcTransferBridgeTransactions: ibcBridgeTransactions,
        latestTransactions: injBridgeTransactions,
      }).filter((tx) => tx.sender === injectiveAddress);

      const uiBridgeTransactionsWithToken = await tokenService.toBridgeTransactionsWithToken(
        transactions
      );
      return uiBridgeTransactionsWithToken.sort((a, b) => b.timestamp - a.timestamp);
    },
  });
}
