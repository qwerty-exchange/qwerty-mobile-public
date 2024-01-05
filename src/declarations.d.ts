declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module 'react-native-config' {
  export interface NativeConfig {
    API_URL: string;
  }
  export const Config: NativeConfig;
  export default Config;
}
