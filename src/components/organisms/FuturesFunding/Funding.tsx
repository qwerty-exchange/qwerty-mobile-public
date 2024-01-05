import { useState } from 'react';
import { View } from 'react-native';

import { Typography } from '@components/atoms/Typography/Typography';
import { useFundingRate } from '@hooks/useExchange';
import { useInterval } from '@hooks/useInterval';
import { formatDate } from '@tools/date';
import { getCurrentTime } from '@tools/getCurrentTime';
import tw from '@tools/tailwind';

export interface FundingProps {
  marketId: string;
}

export const Funding = ({ marketId }: FundingProps) => {
  const { data } = useFundingRate(marketId);

  const [time, setTime] = useState('00:00:00');

  useInterval(() => {
    const now = getCurrentTime();
    const time = new Date(data?.nextFundingTimestamp - now);
    setTime('00' + formatDate(time, 'verboseTime', false).slice(2));
  }, 1000);

  return (
    <View style={tw`flex-1 text-center mb-2`}>
      <Typography style={tw`flex-1 text-center`} size="xxs">
        Funding / Countdown
      </Typography>
      <View style={tw`flex-row justify-center items-center`}>
        <Typography style={Number(data?.fundingRate) > 0 ? 'text-green' : 'text-danger'} size="xs">
          {(Number(data?.fundingRate) * 100).toFixed(5)}
        </Typography>
        <Typography size="xs">/{time}</Typography>
      </View>
    </View>
  );
};
