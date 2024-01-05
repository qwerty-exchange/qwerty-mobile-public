import { View } from 'react-native';

import { DerivativeLimitOrder, SpotLimitOrder } from '@injectivelabs/sdk-ts';
import { BigNumberInBase } from '@injectivelabs/utils';

import { QMarketType } from '@app/common/constants/enum';
import { Label, type LabelProps } from '@app/components/molecules/Label/Label';
import { CloseSVG } from '@assets/icons';
import { Button } from '@components/atoms/Button/Button';
import { Typography } from '@components/atoms/Typography/Typography';
import { useChainOperation } from '@hooks/useChainOperation';
import { useMarketMetadata } from '@hooks/useExchange';
import useMarketPriceFormatter from '@hooks/useMarketPriceFormatter';
import tw from '@tools/tailwind';

export interface CardOrderSpotProps {
  order: SpotLimitOrder | DerivativeLimitOrder;
  marketType: QMarketType;
  onClickClose: (id: SpotLimitOrder) => Promise<void>;
}

export const CardOrder = ({ order, marketType, onClickClose }: CardOrderSpotProps) => {
  const filled = (Number(order.quantity) - Number(order.unfilledQuantity)) / Number(order.quantity);

  const chainOperation = useChainOperation(onClickClose);

  const marketFormat = useMarketPriceFormatter(order.marketId, marketType);
  const price = marketFormat.priceFormat(order.price);
  const quantity = marketFormat.quantityFormat(order.quantity);

  const total = new BigNumberInBase(price).times(new BigNumberInBase(quantity)).toFixed(2);

  let leverage = undefined as BigNumberInBase | undefined;
  if (marketType !== QMarketType.SPOT) {
    const derivativeOrder = order as DerivativeLimitOrder;
    leverage = derivativeOrder.isReduceOnly
      ? new BigNumberInBase('')
      : new BigNumberInBase(derivativeOrder.price).times(
          new BigNumberInBase(derivativeOrder.quantity).dividedBy(derivativeOrder.margin)
        );
  }

  const labels: LabelProps[] = [
    {
      title: 'Type',
      text: 'Limit',
    },
    {
      title: 'Amount',
      text: quantity,
    },
    {
      title: 'Price',
      text: marketFormat.priceFormat(order.price),
    },
    {
      title: 'Filled',
      text: `${filled.toFixed(2)}%`,
    },
    ...(leverage
      ? [
          {
            title: 'Lev.',
            text: isNaN(leverage.toNumber()) ? '-' : `${leverage.toFixed(2)}x`,
          },
        ]
      : []),

    {
      title: 'Value',
      text: `${total}`,
    },
    // {
    //   title: 'Date',
    //   text: new Date(order.createdAt).toISOString(),
    // },
  ];

  const { data: market } = useMarketMetadata(order.marketId) as any;
  return (
    <View style={tw`border-t-[1px] border-shade2 pt-[18px] pb-4`}>
      <View style={tw`flex-row items-center mb-3`}>
        <View style={tw`flex-row gap-2 items-center`}>
          <View
            style={tw` w-4 flex-row  justify-center rounded-sm ${
              order.orderSide === 'buy' ? 'bg-green' : 'bg-danger'
            }`}>
            <Typography size="xs" style={tw`font-demiBold`}>
              {order.orderSide === 'buy' ? 'L' : 'S'}
            </Typography>
          </View>
          <Typography size="sm">{market.ticker}</Typography>
        </View>
        <Button
          style={tw`ml-auto p-1 rounded-[4px] bg-shade2`}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={async () => {
            await chainOperation(order);
          }}
          icon={{ svg: CloseSVG, size: 12, color: tw.color('shade2') }}
        />
      </View>

      <View style={tw`flex-row justify-between`}>
        {labels.map((label, index) => (
          <Label key={index} style={tw``} {...label} />
        ))}
      </View>
    </View>
  );
};
