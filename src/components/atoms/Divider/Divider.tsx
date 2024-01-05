import { View } from 'react-native';

import tw from '@tools/tailwind';

export const Divider = () => {
  return <View style={tw`border-b border-b-shade2 my-4`} />;
};
