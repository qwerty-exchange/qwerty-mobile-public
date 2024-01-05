import { StyleProp, View, ViewStyle } from 'react-native';

import { ClassInput } from 'twrnc/dist/esm/types';

import { TypographyFontSize, Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export interface LabelTextOptions {
  style?: ClassInput;
  typography?: TypographyFontSize;
}

export interface LabelProps {
  title: string | React.FC;
  text: string | React.FC;
  titleOptions?: LabelTextOptions;
  valueOptions?: LabelTextOptions;
  align?: 'left' | 'center' | 'right';
  style?: StyleProp<ViewStyle>;
}

export const Label = ({
  title,
  text,
  titleOptions,
  valueOptions,
  align = 'left',
  style,
}: LabelProps) => {
  const TextComponent = text;

  return (
    <View style={style}>
      {typeof title === 'string' && (
        <Typography
          style={[tw.style('text-tertiary mb-1', { textAlign: align }, titleOptions?.style)]}
          size={titleOptions?.typography ?? 'xs'}>
          {title}
        </Typography>
      )}

      {typeof title !== 'string' && <title />}

      {typeof text === 'string' && (
        <Typography
          style={tw.style('text-white', { textAlign: align }, valueOptions?.style)}
          size={valueOptions?.typography ?? 'sm'}>
          {text}
        </Typography>
      )}

      {typeof TextComponent !== 'string' && <TextComponent />}
    </View>
  );
};
