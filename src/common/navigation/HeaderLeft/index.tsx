import { TouchableOpacity, View } from 'react-native';

import type { HeaderBackButtonProps } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

import { useRouter } from 'expo-router';

import { ArrowLeftSVG } from '@assets/icons';
import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

const HeaderLeft = (props: HeaderBackButtonProps & { baseRoot?: string }) => {
  const navigation = useNavigation();

  const router = useRouter();

  if (!props.canGoBack && !props.baseRoot) {
    return null;
  }

  return (
    <TouchableOpacity
      style={tw`flex-row items-center p-4`}
      onPress={() => (props.canGoBack ? navigation.goBack() : router.replace(props.baseRoot))}>
      <View style={tw`flex-row items-center m--4`}>
        <ArrowLeftSVG style={tw`mr-3`} />
        <Typography style="text-primary">Back</Typography>
      </View>
    </TouchableOpacity>
  );
};

export default HeaderLeft;
