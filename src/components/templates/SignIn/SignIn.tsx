import React from 'react';
import { View, Image } from 'react-native';
import { OnboardFlow, PrimaryButton } from 'react-native-onboard';

import { useRouter } from 'expo-router';

import tw from '@tools/tailwind';

const projectId = 'ca4cb651d77377199cf4b6461f72b104';

const providerMetadata = {
  name: 'QWERTY.EXCHANGE',
  description: 'QWERTY.EXCHANGE',
  url: 'https://qwerty.exchange',
  icons: ['https://qwerty.exchange/logo-big.png'],
};

export const SignIn = () => {
  const router = useRouter();

  const handleOnDone = () => {
    router.push('/qr-reader');
  };

  const primaryButton = (props) => (
    <PrimaryButton {...props} textStyle={tw`text-background`} style={tw`bg-primary`} />
  );

  // const { provider } = useWeb3Modal();

  // const web3Provider = useMemo(
  //   () => (provider ? new ethers.providers.Web3Provider(provider) : undefined),
  //   [provider]
  // );

  // return (
  //   <View style={styles.centered}>
  //     <Web3Button />
  //     <Web3Modal projectId={projectId} providerMetadata={providerMetadata} />
  //   </View>
  // );

  return (
    <View style={{ flex: 1 }}>
      <OnboardFlow
        style={tw`bg-background`}
        titleStyle={tw`text-white`}
        subtitleStyle={tw`text-secondary`}
        paginationColor={tw.color('secondary')}
        paginationSelectedColor={tw.color('primary')}
        PrimaryButtonComponent={(props) => primaryButton(props)}
        onDone={handleOnDone}
        pages={[
          {
            title: 'Welcome to QWERTY',
            subtitle: 'There are 2 simply steps to enable trading on your mobile device.',
            imageUri: Image.resolveAssetSource(require('@assets/images/wizard/wizard-qwerty.png'))
              .uri,
          },
          {
            title: 'Generate QR Code',
            subtitle:
              'Open qwerty.exchange using your PC.\nFind QR Code icon in the right top corner.',
            imageUri: Image.resolveAssetSource(require('@assets/images/wizard/wizard-init.png'))
              .uri,
          },
          {
            title: 'Scan it',
            subtitle: 'Generate your QR Code and scan after clicking the button below.',
            imageUri: Image.resolveAssetSource(require('@assets/images/wizard/wizard-modal.png'))
              .uri,
          },
        ]}
        type="inline"
      />
    </View>
  );
};
