import { Slider } from '../Slider/Slider';

import { useEffect, useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleProp,
  TextInput as TextInputNative,
  View,
  ViewStyle,
} from 'react-native';

import type { ClassInput } from 'twrnc/dist/esm/types';

import { MinusSVG, PlusSVG } from '@assets/icons';
import { Typography } from '@components/atoms/Typography/Typography';
import { Button } from '@components/atoms/Button/Button';
import tw from '@tools/tailwind';

export interface TextInputSelectorGeneralProps {
  title?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  styleInput?: any;
  disabled?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  precision: number;
  keyboardType?: KeyboardTypeOptions;
  autoFocus?: boolean;
  plusMinus?: boolean;
}

export interface TextInputSelectorDefaultProps extends TextInputSelectorGeneralProps {
  mode: 'default';
  rightTitle?: string;
}
export interface TextInputSelectorSliderProps extends TextInputSelectorGeneralProps {
  mode: 'slider';
  min: number;
  max: number;
}

export interface TextInputSelectorPercentProps extends TextInputSelectorGeneralProps {
  mode: 'percent';
  stylePercent?: ClassInput;
  percents: number[];
  onClickPercent: (value: number) => void;
}

// export interface TextInputSelectorPlusMinusProps extends TextInputSelectorGeneralProps {
//   mode: 'default' | 'slider' | 'percent';
//   plusMinus: true;
// }

export type TextInputSelectorProps =
  | TextInputSelectorDefaultProps
  | TextInputSelectorSliderProps
  | TextInputSelectorPercentProps;

export interface PercentsProps {
  percents: number[];
  style?: ClassInput;
  onClick: (value: number) => void;
}

const Percents = ({ percents, style, onClick }: PercentsProps) => {
  return (
    <View style={tw`flex-row gap-1.5 mt-3`}>
      {percents.map((percent, index) => (
        <Button
          key={index}
          onPress={() => onClick(percent)}
          style={tw.style('bg-shade1 flex-1 rounded-md py-1')}>
          <Typography style={'text-tertiary'} size="xxs">
            {percent}%
          </Typography>
        </Button>
      ))}
    </View>
  );
};

export const TextInputSelector = (props: TextInputSelectorProps) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    props.onChange?.(value);
  }, [value]);

  const handleOnBlur = () => {
    setValue(
      Number(Number(value?.replace(',', '.')).toFixed(Math.abs(props.precision))).toString()
    );
  };

  return (
    <View style={props.style}>
      {props.title && (
        <Typography size="xs" style="text-tertiary mb-1">
          {props.title}
        </Typography>
      )}
      <View style={tw`flex-row p-2 rounded-md border-2 border-shade1 max-h-[44px]`}>
        {props.plusMinus && (
          <Button
            style={tw`bg-shade1 p-2 rounded-[4px]`}
            onPress={() => {
              if (value > 0) {
                setValue(
                  (Number(value || 0) - Math.pow(10, props.precision))
                    .toFixed(Math.abs(props.precision))
                    .toString()
                );
              }
            }}
            icon={{ svg: MinusSVG, color: tw.color('shade1'), size: 12 }}
          />
        )}

        <TextInputNative
          style={tw.style(
            'flex-1 text-white h-full py-0',
            props.mode !== 'default' && 'text-center',
            props.plusMinus && 'text-center',
            props.styleInput
          )}
          keyboardType={props.keyboardType}
          placeholder={props.placeholder}
          placeholderTextColor={tw.color('tertiary')}
          selectionColor={tw.color('black')}
          editable={!props.disabled}
          selectTextOnFocus={!props.disabled}
          value={value}
          onChangeText={(text) => setValue(text?.replace(',', '.'))}
          onBlur={handleOnBlur}
          autoFocus={props.autoFocus}
        />

        {props.plusMinus && (
          <Button
            onPress={() => {
              setValue(
                (Number(value || 0) + Math.pow(10, props.precision))
                  .toFixed(Math.abs(props.precision))
                  .toString()
              );
            }}
            style={tw`bg-shade1 p-2 rounded-[4px]`}
            icon={{
              svg: PlusSVG,
              stroke: tw.color('tertiary'),
              strokeWidth: 2,
              size: 12,
            }}
          />
        )}

        {props.mode === 'default' && props.rightTitle && (
          <Typography size="sm" style="text-tertiary ml-1">
            {props.rightTitle}
          </Typography>
        )}
      </View>

      {props.mode === 'slider' && <Slider factor={3.32} />}

      {props.mode === 'percent' && (
        <Percents
          style={props.stylePercent}
          onClick={props.onClickPercent}
          percents={props.percents}
        />
      )}
    </View>
  );
};
