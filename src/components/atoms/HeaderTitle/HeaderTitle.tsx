import { View } from 'react-native';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export interface HeaderTitleProps {
  title: string;
  subtitle: string;
}

export const HeaderTitle = ({ title, subtitle }: HeaderTitleProps) => {
  return (
    <View>
      <Typography style="text-center font-demiBold" size="lg">
        {title}
      </Typography>
      <Typography style="text-center text-tertiary" size="xs">
        {subtitle}
      </Typography>
    </View>
  );
};
