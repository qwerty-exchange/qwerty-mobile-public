import { Image, ImageProps } from 'expo-image';

import { useConfig } from '@app/common/contexts/config';

export interface CryptoCoinIconProps extends ImageProps {
  coin: string;
}

export const CryptoCoinIcon = (props: CryptoCoinIconProps) => {
  const { appConfig } = useConfig();
  return (
    <Image
      cachePolicy="memory-disk"
      source={`${appConfig.metadata}/tokens/${props.coin.toLocaleLowerCase()}.svg`}
      contentFit="cover"
      {...props}
    />
  );
};
