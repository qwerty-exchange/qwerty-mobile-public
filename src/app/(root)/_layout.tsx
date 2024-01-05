import { SvgProps } from 'react-native-svg';

import { Tabs } from 'expo-router';

// import { TabParamList } from '@app/common/navigation/RootRouter';
import { ActivitySVG, HomeSVG, MarketsSVG, PortfolioSVG } from '@assets/icons';
import tw from '@tools/tailwind';

const TAB_ICONS: Record<keyof any, React.FC<SvgProps>> = {
  home: HomeSVG,
  markets: MarketsSVG,
  activity: ActivitySVG,
  portfolio: PortfolioSVG,
};

export const tabBarStyle = tw.style('bg-background border-t-0 pt-2');

export default function Layout() {
  return (
    <>
      <Tabs
        initialRouteName="home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            const Icon = TAB_ICONS[route.name] || TAB_ICONS['home'];
            const color = focused ? tw.color('primary') : tw.color('tertiary');

            return <Icon stroke={color} strokeWidth={2} />;
          },
          tabBarStyle,
          tabBarActiveTintColor: tw.color('primary'),
          tabBarInactiveTintColor: tw.color('tertiary'),
          tabBarLabelStyle: tw`font-regular`,
          tabBarCardStyle: tw.style('bg-background'),
          headerShown: false,
          lazy: true,
          detachInactiveScreens: true,
        })}>
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="markets" options={{ title: 'Markets', lazy: true }} />
        <Tabs.Screen name="portfolio" options={{ title: 'Portfolio' }} />
        <Tabs.Screen name="activity" options={{ title: 'Activity', lazy: true }} />
      </Tabs>
    </>
  );
}
