import { View } from 'react-native';

import type { ClassInput } from 'twrnc/dist/esm/types';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export interface RowLabelProps {
  title: string;
  subtitle: string;
  style?: ClassInput;
}

export const RowLabel = ({ title, subtitle, style }: RowLabelProps) => {
  return (
    <View style={tw.style('flex-row', style)}>
      <Typography style="text-secondary mr-1" size="xs">
        {title}
      </Typography>

      <Typography size="xs" style="text-secondary2">
        {subtitle}
      </Typography>
    </View>
  );
};
