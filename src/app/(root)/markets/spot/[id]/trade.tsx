import { useLayoutEffect } from 'react';
import { View } from 'react-native';

import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { useLocalSearchParams, useNavigation } from 'expo-router';

import { useMarketSummary } from '@app/common/hooks/useExchange';
import HeaderLeft from '@app/common/navigation/HeaderLeft';
import tw from '@app/common/tools/tailwind';
import { HeaderTitle } from '@app/components/atoms/HeaderTitle/HeaderTitle';
import { Spot } from '@app/components/templates/Spot/Spot';

export const screenOptions: NativeStackNavigationOptions = {
  //cardStyle: tw`bg-background`,
  headerStyle: tw.style('bg-background', {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  }),
  headerTitleStyle: tw`text-white font-bold`,
  headerTitleAlign: 'center',
  headerShown: true,
  headerBackground: () => <View style={{ backgroundColor: tw.color('background') }} />,
  headerLeft: HeaderLeft,
  headerBackVisible: false,
  //...TransitionPresets.SlideFromRightIOS,
};

export default function Page() {
  const { id: marketId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { data: market } = useMarketSummary(marketId as string);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle subtitle="Spot" title={market?.name} />,
      headerTitleAlign: 'center',
    });
  }, [market]);

  return <Spot />;
}
