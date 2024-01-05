import { DefaultTheme, Theme } from '@react-navigation/native';

import tw from '@tools/tailwind';

export const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: tw.color('background')!,
  },
};
