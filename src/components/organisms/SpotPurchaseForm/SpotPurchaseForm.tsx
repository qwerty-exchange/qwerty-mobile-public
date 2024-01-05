import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import {
  MsgCreateSpotLimitOrder,
  MsgCreateSpotMarketOrder,
  SpotMarket,
  spotPriceToChainPriceToFixed,
  spotQuantityToChainQuantityToFixed,
} from '@injectivelabs/sdk-ts';
import { orderSideToOrderType } from '@injectivelabs/sdk-ui-ts';
import { OrderSide } from '@injectivelabs/ts-types';
import { BigNumberInBase, BigNumberInWei } from '@injectivelabs/utils';

import { UseQueryResult } from '@tanstack/react-query';

import { QMarketType } from '@app/common/constants/enum';
import { useAccount } from '@app/common/contexts/account';
import {
  PurchaseButton,
  PurchaseType,
} from '@app/components/atoms/Button/PurchaseButton/PurchaseButton';
import { PurchaseTypeSwitcher } from '@app/components/organisms/PurchaseTypeSwitcher/PurchaseTypeSwitcher';
import { Typography } from '@components/atoms/Typography/Typography';
import { ColumnTab } from '@components/molecules/ColumnTab/ColumnTab';
import { useChainOperation } from '@hooks/useChainOperation';
import {
  useUserAccountBalance,
  useMarketMetadata,
  useOrderBooks,
  useMarketSummary,
} from '@hooks/useExchange';
import useMarketPriceFormatter from '@hooks/useMarketPriceFormatter';
import type { CryptoOperationType } from '@models/crypto';
import tw from '@tools/tailwind';
import { CurrencyInputWithControllers } from '@app/components/organisms/FuturesPurchaseForm/FuturesPurchaseForm';

interface LeftColumnProps {
  marketId?: string;
  marketType: QMarketType;
  operationType: CryptoOperationType;
  values;
  handleChange;
}

export const SpotPurchaseForm = ({
  marketId,
  marketType,
  operationType,
  values,
  handleChange,
}: LeftColumnProps) => {
  const { data: market } = useMarketMetadata(marketId) as UseQueryResult<SpotMarket>;
  const formater = useMarketPriceFormatter(marketId, marketType);
  const { data: orderBook } = useOrderBooks(marketId, marketType);
  const { data: balance } = useUserAccountBalance();
  const { data: marketSummary } = useMarketSummary(marketId);

  const baseAsset = useMemo(() => market?.ticker.split('/')[0] || '', [market]);
  const quoteAsset = useMemo(() => market?.ticker?.split('/')[1] || '', [market]);

  const baseAssetBalance = useMemo(
    () =>
      new BigNumberInWei(
        balance?.coins?.filter(
          (coin) => coin.demon.id === market.baseDenom
        )[0]?.availableBalance?.amount
      ).toBase(market.baseToken.decimals),
    [balance]
  );

  const quoteAssetBalance = useMemo(
    () =>
      new BigNumberInWei(
        balance?.coins?.filter(
          (coin) => coin.demon.id === market.quoteDenom
        )[0]?.availableBalance?.amount
      ).toBase(market?.quoteToken?.decimals),
    [balance]
  );

  console.log(quoteAssetBalance, quoteAsset);

  const accountBalance = useMemo(
    () => Number(baseAssetBalance.toFixed()),
    [values.operationType, quoteAssetBalance, baseAssetBalance]
  );

  const { wallet, injectiveAddress, subaccountId } = useAccount();
  const handleCreateOrder = async () => {
    const total =
      values.operationType === 'Buy'
        ? Number(values.price) * Number(values.amount)
        : Number(values.amount);
    if (isNaN(total)) {
      return;
    }

    if (total > accountBalance) {
      Toast.show({
        type: 'info',
        text1: 'Insufficient available balance',
        position: 'bottom',
      });
      return;
    }

    const price =
      values.orderType === 'Limit'
        ? spotPriceToChainPriceToFixed({
            value: values.price,
            quoteDecimals: market.quoteToken.decimals,
          })
        : spotPriceToChainPriceToFixed({
            value:
              values.operationType === 'Buy'
                ? parseFloat((marketSummary.price * 1.2).toFixed(2))
                : parseFloat((marketSummary.price * 0.8).toFixed(2)),
            quoteDecimals: market.quoteToken.decimals,
          });

    const args = {
      injectiveAddress,
      subaccountId,
      orderType: orderSideToOrderType(operationType === 'Buy' ? OrderSide.Buy : OrderSide.Sell),
      marketId,
      feeRecipient: 'inj1xefevqpwr97me59jmkg8mf5auqcf5vgtz7kc85',
      price: spotPriceToChainPriceToFixed({
        value: values.price,
        baseDecimals: market.baseToken.decimals,
        quoteDecimals: market.quoteToken.decimals,
      }),
      quantity: spotQuantityToChainQuantityToFixed({
        value: values.amount,
        baseDecimals: market.baseToken.decimals,
      }),
    };

    const message =
      values.orderType === 'Limit'
        ? MsgCreateSpotLimitOrder.fromJSON(args)
        : MsgCreateSpotMarketOrder.fromJSON(args);

    const response = await wallet.broadcastByToken(message);

    console.log(response);
    if (response.code !== 0) {
      Toast.show({
        type: 'info',
        text1: 'Unable to create order. Code ' + response.code,
        position: 'bottom',
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Order created',
      position: 'bottom',
    });
  };

  const chainOperation = useChainOperation(handleCreateOrder);

  useEffect(() => {
    console.log(values);
  }, [values]);

  useEffect(() => {
    const price = formater.priceFormat(
      values.operationType === 'Buy' ? orderBook?.sells[0].price : orderBook?.buys[0].price
    ) as string;

    handleChange('price')(price);
  }, [values.operationType]);

  return (
    <View style={tw`w-3/5 pr-4`}>
      <PurchaseTypeSwitcher
        value={values.operationType}
        onChange={(value) => handleChange('operationType')(value)}
      />

      <View style={tw`mb-4`}>
        <ColumnTab
          type="simple"
          columns={['Limit', 'Market']}
          value={values.orderType}
          onChange={(value) => handleChange('orderType')(value)}
        />
      </View>

      <CurrencyInputWithControllers
        precision={formater.priceTensMultiplier}
        inputLabel="Price"
        value={values.orderType !== 'Limit' ? 'Market' : values.price}
        disabled={values.orderType !== 'Limit'}
        onChange={(value) => {
          handleChange('price')(value);

          if (!value || !values.amount) {
            handleChange('total')('0');
          } else {
            handleChange('total')((parseFloat(values.amount) * parseFloat(value)).toString());
          }
        }}
        withControlers
      />

      <CurrencyInputWithControllers
        precision={formater.quantityTensMultiplier}
        inputLabel="Amount"
        withRange
        value={values.amount}
        onChange={(value) => {
          handleChange('amount')(value);
          if (!value || !values.price) {
            handleChange('total')('0');
          } else {
            handleChange('total')((parseFloat(value) * parseFloat(values.price)).toString());
          }
        }}
        balance={new BigNumberInBase(
          values.orderType === 'Limit' ? accountBalance / parseFloat(values.price) : accountBalance
        ).toFixed(Math.abs(formater.quantityTensMultiplier), BigNumberInBase.ROUND_DOWN)}
        displayBalance={values.orderType === 'Market'}
        placeholder={`Amount (${baseAsset})`}
        currencyLabel={baseAsset}
        disabled={false}
        withControlers
      />

      {values.orderType === 'Limit' && (
        <CurrencyInputWithControllers
          precision={formater.quantityTensMultiplier}
          inputLabel="Total"
          value={parseFloat(values.total)?.toFixed(2)}
          balance={new BigNumberInBase(quoteAssetBalance).toFixed(
            Math.abs(formater.quantityTensMultiplier),
            BigNumberInBase.ROUND_DOWN
          )}
          onChange={(value) => {
            handleChange('total')(value);
          }}
          disabled={true}
          currencyLabel={quoteAsset}
        />
      )}

      <View style={tw`flex-row mt-2`}>
        <PurchaseButton
          callback={chainOperation}
          variant={values.operationType === 'Buy' ? PurchaseType.BUY : PurchaseType.SELL}>
          <Typography size="sm" style={['font-medium']}>
            {values.operationType} {baseAsset}
          </Typography>
        </PurchaseButton>
      </View>
    </View>
  );
};
