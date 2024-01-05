import { useAccount } from '../../../common/contexts/account';

import { Platform, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import * as Clipboard from 'expo-clipboard';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

import { BaseModal } from './components/BaseModal';
import { useModals } from './Provider';

export const AccountModal = ({ onClose, ...props }: any) => {
  const { injectiveAddress, logOut } = useAccount();
  const modal = useModals();
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(injectiveAddress);
    Toast.show({
      type: 'info',
      text1: 'Address copied to clipboard.',
      position: 'bottom',
    });
    modal.setVisible(false);
  };

  const onPressLogout = async () => {
    onClose();
    logOut();
  };

  return (
    <BaseModal
      {...props}
      swipeDirection={['down']}
      style={tw`justify-end m-0`}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      backdropTransitionOutTiming={0}
      useNativeDriver={Platform.OS === 'android'}>
      <View style={tw`px-6 bg-shade1 pb-8 rounded-t-3xl`}>
        <TouchableOpacity onPress={copyToClipboard} style={tw`py-4 `}>
          <Typography size="base" style="text-secondary2 text-center">
            Copy address
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressLogout} style={tw`py-4 border-t-[1px] border-white/5`}>
          <Typography size="base" style="text-secondary2 text-center">
            Log out
          </Typography>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};
