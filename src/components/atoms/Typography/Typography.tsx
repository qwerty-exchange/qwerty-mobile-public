import { Text, TextProps } from 'react-native';

import { ClassInput } from 'twrnc/dist/esm/types';

import tw from '@tools/tailwind';

export type TypographyFontSize = 'xxs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';

export interface TypographyProps extends Omit<TextProps, 'style'> {
  size?: TypographyFontSize;
  style?: ClassInput | ClassInput[];
}

export const Typography = ({ children, style = [], size = 'base', ...props }: TypographyProps) => {
  const textStyle = Array.isArray(style) ? style : [style];
  return (
    <Text
      {...props}
      style={tw.style(`font-body`, `text-white`, `text-${size}`, `leading-${size}`, ...textStyle)}>
      {children}
    </Text>
  );
};

export const NumberValue = ({
  value,
  style,
  ...props
}: { value: string | number } & TypographyProps) => {
  const val = Number(value);
  const textStyle = Array.isArray(style) ? style : [style];
  const color = (() => {
    if (val > 0) return 'text-green';
    else if (val < 0) return 'text-danger';

    return '';
  })();

  return (
    <Typography style={tw.style(...textStyle, color)} {...props}>
      {val.toString()}
    </Typography>
  );
};
