import { CryptoCoinIcon } from '../CryptoCoinIcon/CryptoCoinIcon';

import { View } from 'react-native';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export interface CryptoCoinProps {
  cryptoCoin: any;
  currency?: any;
  subtitle?: string;
}

export const CryptoCoin = (props: CryptoCoinProps) => {
  return (
    <View style={tw`flex-1 flex-row items-center`}>
      <CryptoCoinIcon
        coin={props.cryptoCoin.split('/')[0].toUpperCase()}
        style={tw`mr-2 h-6 w-6`}
      />
      <View style={tw`flex-1`}>
        <Typography size="xs" style="font-medium text-white" numberOfLines={1} adjustsFontSizeToFit>
          {props.cryptoCoin}
          {props.currency ? `/${props.currency}` : ''}
        </Typography>
        {props.subtitle && (
          <Typography size="xs" style="text-tertiary">
            {props.subtitle}
          </Typography>
        )}
      </View>
    </View>
  );
};
