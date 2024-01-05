import type React from 'react';
import type { SvgProps } from 'react-native-svg';

export interface IconProps {
  svg: React.FC<SvgProps>;
  size?: number;
  color?: string;
  strokeWidth?: number;
  stroke?: string;
}
