import type { FC } from 'react';
import { Platform } from 'react-native';
import Modal, { type ModalProps } from 'react-native-modal';

import tw from '@tools/tailwind';

export interface BaseModalProps extends Partial<Omit<ModalProps, 'isVisible' | 'onClose'>> {
  visible?: boolean;
  onConfirm?: (value?: any) => void;
  onClose?: (value?: any) => void;
}

export const BaseModal: FC<BaseModalProps> = (props: BaseModalProps) => {
  const { visible, ...rest } = props;

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={Platform.OS === 'ios' ? 1 : 0.7}
      backdropColor={tw.color('background')}
      {...rest}>
      {props.children}
    </Modal>
  );
};
