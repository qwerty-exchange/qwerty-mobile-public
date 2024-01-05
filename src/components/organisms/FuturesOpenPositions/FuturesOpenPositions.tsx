import { View, type LayoutChangeEvent } from 'react-native';

import { PositionCard } from '@components/organisms/PositionCard/PositionCard';
import { useUserDerivativePositions } from '@hooks/useExchange';
import tw from '@tools/tailwind';
import { Typography } from '@app/components/atoms/Typography/Typography';
import { IconOrders } from '@assets/icons';

export interface OpenPositionsTabProps {
  marketId?: string;
  onContentHeight: (height: number, key: string) => void;
}

export const FuturesOpenPositions = ({ onContentHeight }: OpenPositionsTabProps) => {
  const onLayout = (event: LayoutChangeEvent) => {
    onContentHeight(event.nativeEvent.layout.height, 'POSITIONS');
  };

  const { data: positions } = useUserDerivativePositions();

  if (!positions.length) {
    return (
      <View style={tw`w-full h-48 bg-background justify-center items-center`}>
        <IconOrders stroke={tw.color(`tertiary`)} />
        <Typography style="text-tertiary p-2" size="xs">
          No open positions
        </Typography>
      </View>
    );
  }

  return (
    <View style={tw`w-full bg-background px-4`} onLayout={onLayout}>
      {positions.map((position, index) => (
        <PositionCard key={index} position={position} />
      ))}
    </View>
  );
};
