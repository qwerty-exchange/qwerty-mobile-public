import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import type { ClassInput } from 'twrnc/dist/esm/types';

import { TypographyFontSize, Typography } from '@app/components/atoms/Typography/Typography';
import { CheckBoxSelectedSVG, CheckBoxUnselectedSVG } from '@assets/icons';
import tw from '@tools/tailwind';

export interface CheckBoxProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  selected?: boolean;
  style?: ClassInput;
  typography?: TypographyFontSize;
}

export const CheckBox = ({ title, selected, style, typography, onPress }: CheckBoxProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={tw.style('flex-row items-center', style)}>
      {selected ? <CheckBoxSelectedSVG /> : <CheckBoxUnselectedSVG />}

      <Typography size={typography} style={tw`ml-4`}>
        {title}
      </Typography>
    </TouchableOpacity>
  );
};
