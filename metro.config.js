const { getDefaultConfig } = require('expo/metro-config');

// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg');
config.resolver.extraNodeModules = require('expo-crypto-polyfills');

module.exports = config;
