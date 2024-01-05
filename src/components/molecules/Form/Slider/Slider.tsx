import { View } from 'react-native';

import { Typography } from '@components/atoms/Typography/Typography';
import { Slider as RNSlider } from '@miblanchard/react-native-slider';
import tw from '@tools/tailwind';

export interface SliderProps {
  factor: number;
}

export const Slider = ({ factor }: SliderProps) => {
  return (
    <View style={tw`flex-row items-center`}>
      <View style={tw`flex-1 mr-[11px]`}>
        <RNSlider
          renderThumbComponent={() => (
            <View style={tw`h-3 w-3 border-[3px] border-primary bg-background rounded-md`} />
          )}
          trackStyle={tw`bg-shade3 h-[2px] rounded-md`}
          minimumTrackTintColor={tw.color('primary')}
        />
      </View>

      <View style={tw`px-1 items-center bg-shade1 rounded-[4px]`}>
        <Typography style="text-tertiary text-center" size="xxs">
          {factor.toFixed(2)}x
        </Typography>
      </View>
    </View>
  );
};
