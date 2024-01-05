import { useMemo } from 'react';
import { View } from 'react-native';

import { BigNumberInBase } from '@injectivelabs/utils';

import { QMarketType } from '@app/common/constants/enum';
import { OrdersClusters } from '@app/components/organisms/OrdersClusters/OrdersClusters';
import { Typography } from '@components/atoms/Typography/Typography';
import { useOrderBooks } from '@hooks/useExchange';
import useMarketPriceFormatter from '@hooks/useMarketPriceFormatter';
import tw from '@tools/tailwind';

export interface OrderBookPageProps {
  marketId: string;
  marketType: QMarketType;
}

export const OrderBookPage = ({ marketId, marketType }: OrderBookPageProps) => {
  const { data } = useOrderBooks(marketId, marketType);
  const formatter = useMarketPriceFormatter(marketId, marketType);

  const { dataBuys, dataSell } = useMemo(() => {
    const sumQuantityBuys = data?.buys
      .slice(0, 10)
      ?.map((x) => new BigNumberInBase(x.quantity))
      ?.reduce((a, b) => a.plus(b), new BigNumberInBase(0));

    const buys =
      (data &&
        data.buys
          .map((x) => ({
            timestamp: x.timestamp,
            price: formatter.priceFormat(x.price),
            quantity: formatter.quantityFormat(x.quantity),
            percent: new BigNumberInBase(x.quantity).dividedBy(sumQuantityBuys).toNumber() * 100,
          }))
          .map((x) => ({
            title: x.quantity,
            value: x.price,
            percent: x.percent,
          }))) ||
      [];

    const sumQuantitySell = data?.sells
      .slice(0, 10)
      ?.map((x) => new BigNumberInBase(x.quantity))
      ?.reduce((a, b) => a.plus(b), new BigNumberInBase(0));

    const sell =
      (data &&
        data.sells
          .map((x) => ({
            timestamp: x.timestamp,
            price: formatter.priceFormat(x.price),
            quantity: formatter.quantityFormat(x.quantity),
            percent: new BigNumberInBase(x.quantity).dividedBy(sumQuantitySell).toNumber() * 100,
          }))
          .map((x) => ({
            title: x.quantity,
            value: x.price,
            percent: x.percent,
          }))) ||
      [];

    return { dataBuys: buys.slice(0, 10), dataSell: sell.slice(0, 10) };
  }, [data]);

  return (
    <View style={tw`w-full px-4 pb-2 flex-row my-2`}>
      <View style={tw`flex-1 mr-4`}>
        <Typography size="xs" style="text-tertiary">
          Ask
        </Typography>
        <OrdersClusters
          onClick={() => {}}
          orders={dataBuys}
          valueAlign="right"
          percentAlign="right"
          variant="buy"
        />
      </View>
      <View style={tw`flex-1`}>
        <Typography size="xs" style="text-tertiary">
          Bid
        </Typography>
        <OrdersClusters
          onClick={() => {}}
          orders={dataSell}
          valueAlign="left"
          percentAlign="left"
          variant="sell"
        />
      </View>
    </View>
  );
};
