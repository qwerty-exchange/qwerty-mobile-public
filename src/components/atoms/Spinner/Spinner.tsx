import React, { useEffect } from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { LogoMini } from '@assets/icons';
import tw from '@tools/tailwind';

interface Props {
  color: ColorValue;
  durationMs?: number;
  height?: number;
}

export const Spinner = ({ color, height = 64, durationMs = 1000 }: Props): JSX.Element => {
  const rotation = useSharedValue(0.01);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: durationMs,
        easing: Easing.linear,
      }),
      -1
    );
    return () => cancelAnimation(rotation);
  }, [rotation]);

  const styles = StyleSheet.create({
    container: {
      width: height,
      height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    background: {
      width: '100%',
      height: '100%',
      borderRadius: height / 2,
      borderWidth: 4,
    },
    progress: {
      width: '100%',
      height: '100%',
      borderRadius: height / 2,
      borderTopColor: tw.color('background'),
      borderRightColor: tw.color('background'),
      borderBottomColor: tw.color('background'),
      borderLeftColor: tw.color('background'),
      borderWidth: 4,
      position: 'absolute',
    },
  });
  return (
    <View style={styles.container}>
      <View style={[styles.background]}>
        <LogoMini />
      </View>

      <Animated.View style={[styles.progress, { borderTopColor: color }, animatedStyles]} />
    </View>
  );
};
