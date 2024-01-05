import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View } from 'react-native';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';
import { IconProps } from '@app/types/types';

export interface TextInputProps extends RNTextInputProps {
  icon?: IconProps;
  rightTitle?: string;
  borderColor?: string;
}

export const TextInput = ({ icon, rightTitle, borderColor, ...props }: TextInputProps) => {
  return (
    <View
      style={tw.style(
        'bg-shade1 rounded-xl p-3 flex-row h-11 items-center',
        borderColor && {
          borderWidth: 1,
          borderColor,
        }
      )}>
      {icon && (
        <icon.svg
          style={tw`mr-3 ml-3`}
          strokeWidth={2}
          stroke={icon.stroke ?? tw.color('secondary')}
          color={icon.color ?? tw.color('secondary')}
          height={icon.size ?? 15}
          width={icon.size ?? 15}
        />
      )}

      <RNTextInput
        style={tw`flex-1 p-0 h-full text-white font-regular`}
        selectionColor={tw.color('white')}
        placeholderTextColor={tw.color('secondary2')}
        {...props}
      />

      {rightTitle && (
        <Typography size="sm" style="text-tertiary">
          {rightTitle}
        </Typography>
      )}
    </View>
  );
};
