import { Stack } from 'expo-router';

import tw from '@app/common/tools/tailwind';
import { AccountHeader } from '@app/components/organisms/AccountHeader/AccountHeader';
import { HomeTemplate } from '@app/components/templates/Home/Home';

export default function Page() {
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
          headerRight: () => <AccountHeader />,
        }}
      />
      <HomeTemplate />
    </>
  );
}
