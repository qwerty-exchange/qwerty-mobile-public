import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const smallerIPhoneX = width < 375 || height < 812;
