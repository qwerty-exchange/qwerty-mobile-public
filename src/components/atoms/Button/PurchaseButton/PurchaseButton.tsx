import { useMemo } from 'react';

import { rgba } from 'polished';

import tw from '@app/common/tools/tailwind';
import { Button } from '@app/components/atoms/Button/Button';
import { Typography } from '@app/components/atoms/Typography/Typography';

export enum PurchaseType {
  SELL,
  BUY,
}

export const PurchaseButton = ({
  callback,
  children,
  variant,
  isActive = true,
  size = '',
}: {
  callback: () => void;
  children: React.ReactNode;
  variant: PurchaseType;
  isActive?: boolean;
  size?: string;
}) => {
  const color = useMemo(() => getBgColor(isActive, variant), [isActive, variant]);

  return (
    <Button style={tw`flex-1 p-4 bg-[${color}] text-white`} onPress={callback}>
      <Typography size="sm" style="font-medium">
        {children}
      </Typography>
    </Button>
  );
};

const getBgColor = (isActive: boolean, variant: PurchaseType) => {
  return !isActive
    ? tw.color('shade2')
    : rgba(tw.color(variant === PurchaseType.SELL ? 'danger' : 'green')!, 0.84);
};
