import { useAccount } from '@app/common/contexts/account';

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { BarCodeScanner } from 'expo-barcode-scanner';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';
import { Redirect } from 'expo-router';

export const QrReader = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const { signIn } = useAccount();

  const navigation = useNavigation() as any;

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (data.length !== 121) {
      return;
    }
    const value = data.split(':') as string[];
    if (value.length !== 3) {
      return;
    }
    setScanned(true);
    const result = await signIn(data);
    if (!result) {
      setScanned(false);
    }
  };

  useEffect(() => {
    if (hasPermission !== null && hasPermission === false) {
      alert('Please allow the app to access your camera in your privacy settings.');
      navigation.navigate('Home', {});
    }
  }, [hasPermission]);

  if (scanned) {
    return <Redirect href="/" />;
  }

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Typography size="base">Requesting for camera permission</Typography>
      </View>
    );
  }
  if (hasPermission === false) {
    return <></>;
  }

  return (
    <View style={tw`flex-1 px-4`}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
