import { Typography } from '@components/atoms/Typography/Typography';
import { MaterialTopTabs } from '@app/components/atoms/MaterialTopTabs/MaterialTopTabs';
import tw from '@tools/tailwind';

export const tabBarStyle = tw.style('bg-background border-t-0 pt-2');

export default function Layout() {
  const align = 'left';
  return (
    <>
      <MaterialTopTabs
        initialRouteName="deposits"
        screenOptions={({ route }) => ({
          tabBarItemStyle: tw.style('px-6 pr-6', align === 'left' && { width: 'auto' }),
          tabBarIndicatorContainerStyle: tw`bg-background`,
          tabBarIndicatorStyle: tw`bg-primary`,
          tabBarStyle: tw.style(
            'bg-background',
            align === 'left' && 'mx-4',
            'border-b-[1px] border-shade2'
          ),
          tabBarLabel: ({ children, focused }) => (
            <Typography
              size="xxs"
              style={['text-center font-demiBold', focused ? 'text-primary' : 'text-tertiary']}>
              {children}
            </Typography>
          ),
        })}>
        <MaterialTopTabs.Screen name="deposits" options={{ title: 'Deposits' }} />
        <MaterialTopTabs.Screen name="withdrawals" options={{ title: 'Withdrawals' }} />
      </MaterialTopTabs>
    </>
  );
}
