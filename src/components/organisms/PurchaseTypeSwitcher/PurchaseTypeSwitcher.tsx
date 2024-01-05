import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import type { CryptoOperationType } from '@models/crypto';
import tw from '@tools/tailwind';
import {
  PurchaseButton,
  PurchaseType,
} from '@app/components/atoms/Button/PurchaseButton/PurchaseButton';

export interface PurchaseTypeSwitcherProps {
  value: CryptoOperationType;
  onChange?: (value: CryptoOperationType) => void;
}

export const PurchaseTypeSwitcher = ({ value, onChange }: PurchaseTypeSwitcherProps) => {
  const onPressOperation = useCallback((value: CryptoOperationType) => {
    onChange(value);
  }, []);

  return (
    <View style={tw`flex-row gap-2 mb-4`}>
      <PurchaseButton
        isActive={value === 'Buy'}
        callback={() => onPressOperation('Buy')}
        variant={PurchaseType.BUY}>
        Buy
      </PurchaseButton>
      <PurchaseButton
        isActive={value === 'Sell'}
        callback={() => onPressOperation('Sell')}
        variant={PurchaseType.SELL}>
        Sell
      </PurchaseButton>
    </View>
  );
};
