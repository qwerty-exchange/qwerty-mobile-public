import { tabBarStyle } from '../_layout';

import { View } from 'react-native';

import { Stack, Tabs, useSegments } from 'expo-router';

import HeaderLeft from '@app/common/navigation/HeaderLeft';
import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export default function Layout() {
  const [root, market, ...rest] = useSegments();

  return (
    <>
      <Tabs.Screen
        options={{
          tabBarStyle:
            rest.length > 0
              ? {
                  display: 'none',
                  height: 0,
                  opacity: 0,
                }
              : tabBarStyle,
        }}
      />
      <Stack
        screenOptions={{
          headerStyle: tw.style('bg-background', {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          }),
          headerTitleStyle: tw`text-white font-bold`,
          headerTitleAlign: 'center',
          headerShown: true,
          headerBackground: () => <View style={{ backgroundColor: tw.color('background') }} />,
          headerLeft: (props) => <HeaderLeft baseRoot="/markets" {...props} />,
          headerBackVisible: false,
        }}>
        <Stack.Screen
          name="index"
          options={{
            headerStyle: tw.style('bg-background', {
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            }),
            headerTitleAlign: 'left',
            headerShown: true,
            title: '',
            headerLeft: () => (
              <Typography style="text-white text-[17px] font-bold ml--1">Markets</Typography>
            ),
          }}
        />
      </Stack>
    </>
  );
}
