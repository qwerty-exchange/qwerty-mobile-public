import { Stack } from 'expo-router';

import { MaterialTopTabs } from '@app/components/atoms/MaterialTopTabs/MaterialTopTabs';
import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export const tabBarStyle = tw.style('bg-background border-t-0 pt-2');

export default function Layout() {
  const align = 'left';
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: tw.style('bg-background', {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          }),
          headerTitleStyle: tw`text-white font-bold`,
          headerTitleAlign: 'left',
          headerShown: true,
          // headerRight: () => <AccountHeader />,
        }}
      />
      <MaterialTopTabs
        initialRouteName="spot"
        screenOptions={({ route }) => ({
          tabBarItemStyle: tw.style('px-6 pr-6', align === 'left' && { width: 'auto' }),
          tabBarIndicatorContainerStyle: tw`bg-background`,
          tabBarScrollEnabled: true,
          tabBarIndicatorStyle: tw`bg-primary`,
          tabBarStyle: tw.style(
            'bg-background',
            align === 'left' && 'mx-4',
            'border-b-[1px] border-shade2'
          ),
          tabBarLabel: ({ children, focused }) => (
            <Typography
              size="sm"
              style={['text-center font-demiBold', focused ? 'text-primary' : 'text-tertiary']}>
              {children}
            </Typography>
          ),
        })}>
        <MaterialTopTabs.Screen name="positions" options={{ title: 'Positions' }} />
        <MaterialTopTabs.Screen name="spot" options={{ title: 'Spot' }} />
        <MaterialTopTabs.Screen name="derivatives" options={{ title: 'Derivatives' }} />
        <MaterialTopTabs.Screen name="wallet-history" options={{ title: 'Wallet History' }} />
      </MaterialTopTabs>
    </>
  );
}
