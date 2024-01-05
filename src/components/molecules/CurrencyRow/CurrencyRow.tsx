import { View } from 'react-native';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export interface CurrencyRowProps {
  value: number;
  onUSD: number;
}

export const CurrencyRow = ({ value, onUSD }: CurrencyRowProps) => {
  return (
    <View>
      <Typography size="sm" style="font-medium">
        {value}
      </Typography>

      <Typography size="xs" style="text-tertiary">
        ~{onUSD} USD
      </Typography>
    </View>
  );
};
