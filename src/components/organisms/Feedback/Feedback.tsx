import type { FC } from 'react';
import React, { createContext, useContext, useState } from 'react';
import { View } from 'react-native';

import { Spinner } from '@app/components/atoms/Spinner/Spinner';
import tw from '@tools/tailwind';

export interface FeedbackContextProps {
  setVisible: (value: boolean) => void;
  isOpen: boolean;
}

const FeedbackContext = createContext<FeedbackContextProps>({
  setVisible: () => {},
  isOpen: false,
});

export const FeedbackContextProvider: FC<{
  children?: React.ReactNode;
}> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <FeedbackContext.Provider value={{ isOpen: visible, setVisible }}>
      {props.children}
      <Feedback />
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);

const Feedback = () => {
  const { isOpen } = useFeedback();

  return isOpen && <BusyScreen />;
};

export const BusyScreen: FC<{
  children?: React.ReactNode;
}> = (props) => {
  return (
    <View
      style={tw`left-0 right-0 top-0 bottom-0 absolute z-50 w-full h-full bg-background/80 justify-center items-center`}>
      {props.children || <Spinner color={tw.color('primary')} />}
    </View>
  );
};
