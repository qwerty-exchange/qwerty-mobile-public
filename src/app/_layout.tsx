import React, { useCallback, useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableFreeze, enableScreens } from 'react-native-screens';
import Toast, { InfoToast } from 'react-native-toast-message';
import usePromise from 'react-use-promise';

import { ThemeProvider } from '@react-navigation/native';

import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';

import { useFonts } from 'expo-font';
import * as LocalAuthentication from 'expo-local-authentication';
import { Slot, SplashScreen } from 'expo-router';
import { useDeviceContext } from 'twrnc';

import { AccountContextProvider } from '@app/common/contexts/account';
import { ConfigProvider } from '@app/common/contexts/config';
import { AuthGuard } from '@app/common/hoc/auth.guard';
import { useAppState } from '@app/common/hooks/useAppState';
import { useOnlineManager } from '@app/common/hooks/useOnlineManager';
import tw from '@app/common/tools/tailwind';
import { FeedbackContextProvider } from '@app/components/organisms/Feedback/Feedback';
import { ModalsContextProvider, Modals } from '@app/components/organisms/modals/Provider';
import { ScreenSaver } from '@app/components/organisms/ScreenSaver/ScreenSaver';
import LogRocket from '@logrocket/react-native';
import { theme as navigationTheme } from '@navigation/theme';
import { ApiProvider } from '@app/common/contexts/api';

function onAppStateChange(status) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

SplashScreen.preventAutoHideAsync();

export default function Root() {
  enableFreeze(true);
  useDeviceContext(tw);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      enableScreens(false);
    }
  }, []);

  const [fontsLoaded] = useFonts({
    'GolosText-Regular': require('@assets/fonts/GolosText-Regular.ttf'),
    'GolosText-Medium': require('@assets/fonts/GolosText-Medium.ttf'),
    'GolosText-DemiBold': require('@assets/fonts/GolosText-DemiBold.ttf'),
    'GolosText-Bold': require('@assets/fonts/GolosText-Bold.ttf'),
    'GolosText-Black': require('@assets/fonts/GolosText-Black.ttf'),
  });

  // return (
  //   <>
  //     {!fontsLoaded && <SplashScreen />}
  //     <Slot />
  //   </>
  // );

  const [result] = usePromise(async () => await LocalAuthentication.getEnrolledLevelAsync(), []);

  useEffect(() => {
    if (__DEV__ === false) {
      LogRocket.init('hanalk/qwerty');
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded && result !== LocalAuthentication.SecurityLevel.NONE) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, result]);

  useEffect(() => {
    if (result !== undefined && result === LocalAuthentication.SecurityLevel.NONE) {
      alert('Sorry, your device must have screen lock enabled.');
    }
  }, [result]);

  useOnlineManager();
  useAppState(onAppStateChange);

  const infoBuilder = useCallback(
    (props) => (
      <InfoToast
        {...props}
        style={tw`bg-shade3 border-l-shade3 opacity-80`}
        renderLeadingIcon={undefined}
        renderTrailingIcon={undefined}
        text1Style={{
          ...tw`font-body text-base leading-base  text-white text-center`,
        }}
      />
    ),
    []
  );

  const toastConfig = {
    info: infoBuilder,
  };

  if (!fontsLoaded) {
    return <Slot />;
  }

  return (
    // Setup the auth context and render our layout inside of it.
    <>
      <SafeAreaProvider>
        <ConfigProvider>
          <ThemeProvider value={navigationTheme}>
            <ModalsContextProvider>
              <QueryClientProvider client={queryClient}>
                <AccountContextProvider>
                  <ApiProvider>
                    <AuthGuard>
                      <FeedbackContextProvider>
                        <ScreenSaver>
                          <Slot />
                          <Modals />
                          <StatusBar backgroundColor={tw.color('background')} />
                          <Toast config={toastConfig} />
                        </ScreenSaver>
                      </FeedbackContextProvider>
                    </AuthGuard>
                  </ApiProvider>
                </AccountContextProvider>
              </QueryClientProvider>
            </ModalsContextProvider>
          </ThemeProvider>
        </ConfigProvider>
      </SafeAreaProvider>
    </>
  );
}
