/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import './expo-crypto-shim.js'
import './i18n';
import 'text-encoding-polyfill'

const { Platform, LogBox } = require('react-native');
// require('fast-text-encoding');

if (Platform.OS !== 'web') {
  require('react-native-get-random-values');

  const IGNORED_LOGS = [
    "The provided value 'ms-stream' is not a valid 'responseType'.",
    "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  ];

  LogBox.ignoreLogs(IGNORED_LOGS);

  // Workaround for Expo 45
  if (__DEV__) {
    const withoutIgnored = (logger) => (...args) => {
      const output = args.join(' ');

      if (!IGNORED_LOGS.some(log => output.includes(log))) {
        logger(...args);
      }
    };

    console.log = withoutIgnored(console.log);
    console.info = withoutIgnored(console.info);
    console.warn = withoutIgnored(console.warn);
    console.error = withoutIgnored(console.error);
  }
}

if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

global.btoa = global.btoa || require('base-64').encode;
global.atob = global.atob || require('base-64').decode;

process.version = 'v9.40';

import "expo-router/entry";


// const { registerRootComponent, scheme } = require('expo');
// const { default: App } = require('./App');

// registerRootComponent(App)