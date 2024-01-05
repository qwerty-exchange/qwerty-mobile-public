import { useAccount } from '../../../common/contexts/account';

import { TouchableOpacity } from 'react-native';

import { ArrowDownSVG } from '@assets/icons';
import { Typography } from '@components/atoms/Typography/Typography';
import { useModals } from '@components/organisms/modals/Provider';
import tw from '@tools/tailwind';

export const AccountHeader = () => {
  const modals = useModals();
  const { injectiveAddress } = useAccount();

  const onPressAccount = () => {
    modals.setModal({
      name: 'accountModal',
      props: { title: '123123', onClose: () => modals.setVisible(false) },
    });
  };

  return (
    <TouchableOpacity onPress={onPressAccount} style={tw`flex-row mr-5 items-center`}>
      <Typography size="sm" style={tw`font-demiBold mr-4`}>
        {injectiveAddress.substring(0, 5) + '...' + injectiveAddress.slice(-5)}
      </Typography>
      <ArrowDownSVG />
    </TouchableOpacity>
  );
};
