import { View } from 'react-native';

import {
  DerivativeMarketWithoutBinaryOptions,
  Position,
  TradeDirection,
} from '@injectivelabs/sdk-ts';

import { UseQueryResult } from '@tanstack/react-query';

import { QMarketType } from '@app/common/constants/enum';
import type { LabelProps } from '@app/components/molecules/Label/Label';
import { Button } from '@components/atoms/Button/Button';
import { Typography } from '@components/atoms/Typography/Typography';
import { Label } from '@components/molecules/Label/Label';
import { useModals } from '@components/organisms/modals/Provider';
import { useMarketMetadata } from '@hooks/useExchange';
import useMarketPriceFormatter from '@hooks/useMarketPriceFormatter';
import tw from '@tools/tailwind';
import { transformPositionUI } from '@transformers/position';

export interface PositionCardProps {
  position: Position;
}

export const PositionCard = ({ position }: PositionCardProps) => {
  const marketFormat = useMarketPriceFormatter(position.marketId, QMarketType.DERIVATIVE);
  const { data: market } = useMarketMetadata(position.marketId) as any as UseQueryResult<
    DerivativeMarketWithoutBinaryOptions,
    unknown
  >;

  const modal = useModals();

  const handleIncreaseMargin = () => {
    modal.setModal({
      name: 'increaseMarginModal',
      props: {
        marketId: position.marketId,
      },
    });
  };

  const handleClosePosition = () => {
    modal.setModal({
      name: 'closePositionModal',
      props: {
        marketId: position.marketId,
      },
    });
  };

  const positionUI = transformPositionUI(position, market);

  const labelsZero: LabelProps[] = [
    {
      title: `Unrealized PNL`,
      text: `${marketFormat.priceFormat(positionUI.pnl)}`,
      titleOptions: {
        typography: 'sm',
      },
      valueOptions: {
        typography: '2xl',
        style: `font-demiBold ${positionUI.pnl.isGreaterThan(0) ? 'text-green' : 'text-danger'}`,
      },
      align: 'left',
    },
    {
      title: 'ROE',
      text: `${positionUI.percentagePnl.toFormat(2)}%`,
      titleOptions: {
        typography: 'sm',
      },
      valueOptions: {
        typography: '2xl',
        style: `font-demiBold ${positionUI.pnl.isGreaterThan(0) ? 'text-green' : 'text-danger'}`,
        //color: tw.color(positionUI.pnl.isGreaterThan(0) ? 'green' : 'danger'),
      },
      align: 'right',
    },
  ];
  const labelsOne: LabelProps[] = [
    {
      title: `Size ${market?.ticker?.split('/')[0]}`,
      text: marketFormat.quantityFormat(position.quantity),
    },
    {
      title: 'Total',
      text: marketFormat.priceFormat(positionUI.total),
    },
    {
      title: 'Margin',
      text: marketFormat.priceFormat(position.margin),
    },
    {
      title: 'Leverage',
      text: `${positionUI.leverage.toFormat(2)}x`,
      align: 'right',
    },
  ];

  const labelsTwo: LabelProps[] = [
    {
      title: 'Entry',
      text: () => (
        <View style={tw`flex-row items-center`}>
          <Typography size="sm" style={tw`text-left mr-1`}>
            {marketFormat.priceFormat(position.entryPrice)}
          </Typography>
        </View>
      ),
    },
    {
      title: 'Mark',
      text: () => (
        <View style={tw`flex-row items-center`}>
          <Typography size="sm" style={tw`text-left mr-1`}>
            {marketFormat.priceFormat(position.markPrice)}
          </Typography>
        </View>
      ),
    },
    {
      title: 'Price liq.',
      text: () => (
        <View style={tw`flex-row items-center`}>
          <Typography size="sm" style={tw`text-left mr-1`}>
            {marketFormat.priceFormat(positionUI.liquidationPrice)}
          </Typography>
        </View>
      ),
    },
    {
      title: 'Risk',
      // markPrice.value.times(quantity.value)
      text: `${positionUI.marginMin}%`,
      align: 'right',
    },
  ];

  return (
    <View style={tw`border-t-[1px] border-shade2 pt-[18px] pb-4`}>
      <View style={tw`flex-row gap-2 items-center pb-4`}>
        <View
          style={tw`w-4 flex-row justify-center rounded-sm ${
            position.direction === TradeDirection.Long ? 'bg-green' : 'bg-danger'
          }`}>
          <Typography size="xs" style={tw`font-demiBold`}>
            {position.direction === TradeDirection.Long ? 'L' : 'S'}
          </Typography>
        </View>

        <Typography size="xl" style={tw`text-left mr-1`}>
          {market.ticker}
        </Typography>
      </View>
      <View style={tw`flex-row mb-4`}>
        {labelsZero.map((label, index) => (
          <Label key={index} style={tw`flex-1`} {...label} />
        ))}
      </View>
      <View style={tw`flex-row`} />
      <View style={tw`flex-row mb-4`}>
        {labelsOne.map((label, index) => (
          <Label key={index} style={tw`flex-1`} {...label} />
        ))}
      </View>
      <View style={tw`flex-row`} />

      <View style={tw`flex-row`}>
        {labelsTwo.map((label, index) => (
          <Label key={index} style={tw`flex-1`} {...label} />
        ))}
      </View>

      <View style={tw`flex-row mt-4`}>
        <Button
          onPress={handleIncreaseMargin}
          style={tw`flex-1 text-center bg-shade2 py-[4] rounded-sm text-secondary2`}>
          <Typography size="sm">Add margin</Typography>
        </Button>
        <View style={tw`flex-1 mr-5`} />
        {/* <Button
          style={tw`flex-1 mr-5 bg-shade3 py-[8px] rounded-[4px] text-secondary2 text-center`}>
          Reduce position
        </Button> */}
        <Button
          onPress={handleClosePosition}
          style={tw`flex-1 bg-shade2 py-[4] rounded-sm text-secondary2 text-center`}>
          <Typography size="sm">Close</Typography>
        </Button>
      </View>
    </View>
  );
};
