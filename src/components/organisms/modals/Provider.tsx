import React, { createContext, useContext, useEffect, useState } from 'react';
import type { FC } from 'react';

import { AccountModal } from './AccountModal';
import { ClosePositionModalProps, ClosePositionModal } from './ClosePositionModal';
import { DropdownLeveragePopupProps, DropdownLeveragePopup } from './DropdownPopup';
import { ExampleModalProps } from './Filter';
import { IncreaseMarginModalProps, IncreaseMarginModal } from './IncreaseMarginModal';

export type Modal =
  | { name: 'accountModal'; props: ExampleModalProps }
  | { name: 'increaseMarginModal'; props: IncreaseMarginModalProps }
  | { name: 'dropdownLeveragePopup'; props: DropdownLeveragePopupProps }
  | { name: 'closePositionModal'; props: ClosePositionModalProps };

export interface ModalsContextProps {
  modal: Modal | null;
  setVisible: (value: boolean) => void;
  setModal: React.Dispatch<React.SetStateAction<Modal | null>>;
  isOpened: (name: Modal['name']) => boolean;
}

const ModalsContext = createContext<ModalsContextProps>({
  modal: null,
  setVisible: () => {},
  setModal: () => {},
  isOpened: () => false,
});

export const ModalsContextProvider: FC<{
  children?: React.ReactNode;
}> = (props) => {
  const [modal, setModal] = useState<Modal | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const isOpened = (name: Modal['name']) => modal?.name === name && visible;

  useEffect(() => setVisible(!!modal), [modal]);

  return (
    <ModalsContext.Provider value={{ modal, setModal, isOpened, setVisible }}>
      {props.children}
    </ModalsContext.Provider>
  );
};

export const useModals = () => useContext(ModalsContext);

export const Modals = () => {
  const { modal, setVisible, setModal, isOpened } = useModals();

  const onClose = () => {
    if (modal?.props.onClose) {
      modal.props.onClose();
      return;
    }

    setVisible(false);
  };

  const onModalHide = () => {
    if (modal?.props.onModalHide) {
      modal.props.onModalHide();
    }

    setVisible(false);
  };

  return (
    <>
      <AccountModal
        onModalHide={onModalHide}
        visible={isOpened('accountModal')}
        onClose={onClose}
      />
      <IncreaseMarginModal
        onModalHide={onModalHide}
        visible={isOpened('increaseMarginModal')}
        onClose={onClose}
        {...(modal?.props as IncreaseMarginModalProps)}
      />
      <ClosePositionModal
        onModalHide={onModalHide}
        visible={isOpened('closePositionModal')}
        onClose={onClose}
        {...(modal?.props as ClosePositionModalProps)}
      />
      <DropdownLeveragePopup
        onModalHide={onModalHide}
        visible={isOpened('dropdownLeveragePopup')}
        onClose={onClose}
        {...(modal?.props as any)}
      />
    </>
  );
};
