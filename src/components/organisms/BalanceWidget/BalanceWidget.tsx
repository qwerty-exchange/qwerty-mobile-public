import { View } from 'react-native';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export interface BalanceProps {
  balance: number;
}

export const BalanceWidget = ({ balance }: BalanceProps) => {
  return (
    <View style={tw`bg-shade1 p-5 rounded-xl flex-row mt-3`}>
      <View style={tw`flex-1`}>
        <Typography size="sm" style="text-tertiary mb-2">
          Total Balance
        </Typography>
        <Typography size="2xl" style="font-bold">
          ${balance}
        </Typography>
      </View>
    </View>
  );
};
