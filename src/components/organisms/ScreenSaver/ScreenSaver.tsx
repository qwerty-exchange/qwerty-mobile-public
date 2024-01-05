import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Image, View } from 'react-native';

import tw from '@tools/tailwind';

export const ScreenSaver: FC<{
  children?: React.ReactNode;
}> = (props) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      {appStateVisible !== 'active' ? <SplashScreen /> : <></>}
      {props.children}
    </>
  );
};

const SplashScreen: FC = () => {
  return (
    <View
      style={tw`left-0 right-0 top-0 bottom-0 absolute z-50 w-full h-full bg-background justify-center items-center`}>
      <Image source={require('@assets/images/logo.png')} />
    </View>
  );
};
