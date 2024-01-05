import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CryptoOperationType } from '@models/crypto';
import tw from '@tools/tailwind';

import {
  PurchaseButton,
  PurchaseType,
} from '@app/components/atoms/Button/PurchaseButton/PurchaseButton';

export interface BottomButtonsProps {
  onPress: (type: CryptoOperationType) => void;
}

export const BottomButtons = ({ onPress }: BottomButtonsProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={tw.style('flex-row gap-4 px-4', {
        marginBottom: insets.bottom || (tw`mb-2`['height'] as number),
      })}>
      <PurchaseButton callback={() => onPress('Buy')} variant={PurchaseType.BUY}>
        Buy
      </PurchaseButton>
      <PurchaseButton callback={() => onPress('Sell')} variant={PurchaseType.SELL}>
        Sell
      </PurchaseButton>
    </View>
  );
};
