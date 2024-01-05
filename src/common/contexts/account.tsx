import { TokenSignClient } from '../services/MsgQwertyBroadcaster';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getDefaultSubaccountId } from '@injectivelabs/sdk-ts';

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

import { useConfig } from './config';

export const useAccount = () => useContext(AccountContext);

const STORAGE_KEY = {
  Wallet: 'wallet',
  IsSignIn: 'isSignIn',
};

export const AccountContext = createContext({
  wallet: undefined as TokenSignClient,
  injectiveAddress: '',
  subaccountId: '',
  signIn: async (_: string) => false,
  logOut: () => {},
});

export const AccountContextProvider = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [wallet, setWallet] = useState<TokenSignClient>();
  const { appConfig } = useConfig();

  const signIn = useCallback(async (data: string) => {
    const [address, key, expire] = data.split(':');
    const resultAuthenticate = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Save your QWERTY Account',
      disableDeviceFallback: false,
    });
    if (resultAuthenticate.success) {
      await SecureStore.setItemAsync(STORAGE_KEY.Wallet, JSON.stringify({ address, key, expire }), {
        authenticationPrompt: 'Save QWERTY Account',
        keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        requireAuthentication: false,
      });
      await AsyncStorage.setItem(STORAGE_KEY.IsSignIn, 'y');
      setWallet(
        new TokenSignClient(
          appConfig.chainId,
          appConfig.injectiveNetworkEndpoints,
          address,
          key,
          appConfig.feePayer,
          appConfig.feePayerSignerDetails,
          appConfig.txEndpoint,
          appConfig.txMemo
        )
      );
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if ((await AsyncStorage.getItem(STORAGE_KEY.IsSignIn)) === null) {
          setReady(true);
          return;
        }
        const resultAuthenticate = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Access to your QWERTY Account',
          disableDeviceFallback: false,
        });

        if (resultAuthenticate.success) {
          const data = await SecureStore.getItemAsync(STORAGE_KEY.Wallet, {
            authenticationPrompt: 'Access to your QWERTY Account',
            keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
            requireAuthentication: false,
          });

          if (data !== null) {
            const jsonValue = JSON.parse(data);
            setWallet(
              new TokenSignClient(
                appConfig.chainId,
                appConfig.injectiveNetworkEndpoints,
                jsonValue.address,
                jsonValue.key,
                appConfig.feePayer,
                appConfig.feePayerSignerDetails,
                appConfig.txEndpoint,
                appConfig.txMemo
              )
            );
          }
          setReady(true);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const logOut = useCallback(async () => {
    SecureStore.deleteItemAsync(STORAGE_KEY.Wallet);
    await AsyncStorage.removeItem(STORAGE_KEY.IsSignIn);
    setWallet(null);
  }, []);

  const subaccountId = useMemo(
    () => (wallet ? getDefaultSubaccountId(wallet.injectiveAddress) : ''),
    [wallet]
  );

  return (
    <AccountContext.Provider
      value={{
        wallet,
        injectiveAddress: wallet?.injectiveAddress || '',
        subaccountId,
        signIn,
        logOut,
      }}>
      {ready ? children : <></>}
    </AccountContext.Provider>
  );
};
