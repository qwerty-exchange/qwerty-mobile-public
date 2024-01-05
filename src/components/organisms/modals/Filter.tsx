import { Platform, View } from 'react-native';

import { Button } from '@app/components/atoms/Button/Button';
import { CheckBox } from '@app/components/molecules/Form/CheckBox/CheckBox';
import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

import { BaseModal } from './components/BaseModal';
import type { BaseModalProps } from './components/BaseModal';

export interface ExampleModalProps extends BaseModalProps {
  title?: string;
}

const ExampleModal = ({ title, onClose, ...props }: ExampleModalProps) => {
  return (
    <BaseModal
      {...props}
      swipeDirection={['down']}
      style={tw`justify-end m-0`}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      backdropTransitionOutTiming={0}
      useNativeDriver={Platform.OS === 'android'}>
      <View style={tw`p-5 bg-background border-shade1 border-2 rounded-t-3xl`}>
        <Typography size="lg" style={tw`mb-6`}>
          Filter
        </Typography>

        <CheckBox title="Show margin currency only" selected />

        <CheckBox style={tw`mb-10 mt-5`} title="Hide small balance" />

        <Button>Apply</Button>
      </View>
    </BaseModal>
  );
};

export default ExampleModal;
