import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';
import React from 'react';
import { View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export interface TopTabBarProps {
  children: any;
}

// TODO: change to https://reactnavigation.org/docs/tab-view
// TODO: Scrolling inside
export const TabList = ({ children, height }: TopTabBarProps & { height: number }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarItemStyle: tw.style('px-6 pr-6'),
        tabBarIndicatorContainerStyle: tw`bg-background`,
        tabBarIndicatorStyle: tw`bg-primary`,
        tabBarStyle: tw.style('bg-background border-b-[1px] border-shade2'),
        tabBarLabel: ({ focused }) => (
          <Typography
            size="sm"
            style={['text-center font-demiBold', focused ? 'text-primary' : 'text-tertiary']}>
            {route.name}
          </Typography>
        ),
      })}
      style={tw.style({
        minHeight: height,
      })}>
      {React.Children.map(children, ({ props }) => {
        return (
          <Tab.Screen name={props.title} options={{ title: props.title }}>
            {props.render}
          </Tab.Screen>
        );
      })}
    </Tab.Navigator>
  );
};

export const TabPanel = ({ render, title }: { render: () => JSX.Element; title: string }) => <></>;
