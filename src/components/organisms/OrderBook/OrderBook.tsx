import { useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { BigNumberInBase } from '@injectivelabs/utils';

import { Price } from '@app/components/molecules/Price/Price';
import { OrdersClusters } from '@components/organisms/OrdersClusters/OrdersClusters';
import { useMarketSummary, useOrderBooks } from '@hooks/useExchange';
import useMarketPriceFormatter from '@hooks/useMarketPriceFormatter';
import tw from '@tools/tailwind';

export const OrderBook = ({ marketId, marketType, onClick }) => {
  const { data } = useOrderBooks(marketId, marketType);
  const { data: marketSummary } = useMarketSummary(marketId);
  const formatter = useMarketPriceFormatter(marketId, marketType);

  const size = 10;

  const { dataBuys, dataSell } = useMemo(() => {
    const sumQuantityBuys = data?.buys
      .slice(0, size)
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
            title: x.price,
            value: x.quantity,
            percent: x.percent,
          }))) ||
      [];

    const sumQuantitySell = data?.sells
      ?.slice(0, size)
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
            title: x.price,
            value: x.quantity,
            percent: x.percent,
          }))) ||
      [];

    return { dataBuys: buys.slice(0, size), dataSell: sell.slice(0, size) };
  }, [data]);

  return (
    <View>
      <OrdersClusters
        orders={dataSell.reverse()}
        valueAlign="right"
        percentAlign="left"
        variant="sell"
        onClick={onClick}
      />
      <Price
        style={tw`text-center my-2`}
        size="base"
        price={Number(marketSummary.price).toFixed(Math.abs(formatter.priceTensMultiplier))}
        currency={marketSummary.name.split(' ')[0].split('/')[1]}
      />
      <OrdersClusters
        onClick={onClick}
        orders={dataBuys}
        valueAlign="right"
        percentAlign="left"
        variant="buy"
      />
    </View>
  );
};
