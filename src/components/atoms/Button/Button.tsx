import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

import type { ClassInput } from 'twrnc/dist/esm/types';

import { Typography } from '@app/components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

interface IconProps {
  svg: React.FC<SvgProps>;
  size?: number;
  color?: string;
  strokeWidth?: number;
  stroke?: string;
}

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  icon?: IconProps;
  transparent?: boolean;
  style?: ClassInput;
  children?: React.ReactNode;
}

export const Button = ({ children, icon, transparent, style, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
      {...props}
      style={tw.style(
        'p-1.5 rounded-lg justify-center items-center',
        {
          backgroundColor: transparent ? undefined : tw.color('primary'),
          borderWidth: transparent ? 1 : 0,
          borderColor: tw.color('shade1'),
        },
        style
      )}>
      {typeof children === 'string' ? <Typography>{children}</Typography> : children}
      {icon && (
        <icon.svg
          fill={icon.color}
          stroke={icon.stroke}
          strokeWidth={icon.strokeWidth ?? 2}
          height={icon.size ?? 12}
          width={icon.size ?? 12}
        />
      )}
    </TouchableOpacity>
  );
};
