import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

const Tab = createMaterialTopTabNavigator();

export interface TopTabProps {
  title: string;
  component: React.FC;
}

export interface TopTabBarProps {
  tabs: TopTabProps[];
  align?: 'left' | 'center';
  contentHeight?: number;
}

const MIN_HEIGHT_EXTRA = 40 as const;

// TODO: to remove
export const TopBar = ({ tabs, align = 'left', contentHeight }: TopTabBarProps) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarItemStyle: tw.style('px-6 pr-6', align === 'left' && { width: 'auto' }),
        tabBarIndicatorContainerStyle: tw`bg-background`,
        tabBarIndicatorStyle: tw`bg-primary`,
        tabBarStyle: tw.style(
          'bg-background',
          align === 'left' && 'mx-4',
          'border-b-[1px] border-shade2'
        ),
        tabBarLabel: ({ focused }) => (
          <Typography
            size="sm"
            style={['text-center font-demiBold', focused ? 'text-primary' : 'text-tertiary']}>
            {route.name}
          </Typography>
        ),
      })}
      style={tw.style(
        !!contentHeight && {
          minHeight: contentHeight + MIN_HEIGHT_EXTRA,
        }
      )}>
      {tabs.map((tab, index) => (
        <Tab.Screen key={index} name={tab.title} options={{ title: tab.title }}>
          {() => <tab.component />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};
