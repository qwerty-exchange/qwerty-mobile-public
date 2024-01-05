import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { DropdownOption } from '@app/components/molecules/Form/Dropdown/Dropdown';
import { RectangleSVG } from '@assets/icons';
import { Button } from '@components/atoms/Button/Button';
import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

import { BaseModal } from './components/BaseModal';
import type { BaseModalProps } from './components/BaseModal';

export interface DropdownLeveragePopupProps extends BaseModalProps {
  options: DropdownOption[];
  selected: string;
  onChange;
}

const PADDING_BOTTOM = 8 as const;

export const DropdownLeveragePopup = ({
  options,
  selected,
  onConfirm,
  onClose,
  onChange,
  ...props
}: DropdownLeveragePopupProps) => {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState(selected);

  useEffect(() => {
    setValue(selected);
  }, [props.visible]);

  return (
    <BaseModal
      {...props}
      swipeDirection={['down']}
      style={tw`justify-end m-0`}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      backdropTransitionOutTiming={0}>
      <View
        style={tw.style('px-6 bg-shade1 pb-8 rounded-t-3xl', {
          maxHeight: hp(80),
          paddingBottom: insets.bottom || PADDING_BOTTOM,
        })}>
        <View style={tw`mb-5`}>
          <RectangleSVG style={tw`self-center mb-5`} />
          <Typography size="xl" style={tw`text-center mb-8`}>
            Choose leverage
          </Typography>
          {options?.map((option, index) => (
            <View style={tw`border-t-[1px] border-shade2`}>
              <TouchableOpacity
                onPress={() => {
                  onChange(option.key);
                  onClose();
                }}
                key={index}
                style={tw`py-3`}>
                <Typography
                  size="base"
                  style={[
                    'text-center',
                    tw.color(value === option.key ? 'primary' : 'secondary2'),
                  ]}>
                  {option.title}
                </Typography>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </BaseModal>
  );
};
