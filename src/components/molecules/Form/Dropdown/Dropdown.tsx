import { TouchableOpacity } from 'react-native';

import type { ClassInput } from 'twrnc/dist/esm/types';

import { ArrowDownSVG } from '@assets/icons';
import { Typography } from '@components/atoms/Typography/Typography';
import { useModals } from '@components/organisms/modals/Provider';
import tw from '@tools/tailwind';

export interface DropdownOption {
  key: string;
  title: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChangeValue: (value: string) => void;
  style?: ClassInput;
}

export const Dropdown = ({ options, value, style, onChangeValue }: DropdownProps) => {
  const modals = useModals();

  const onOpen = () => {
    modals.setModal({
      name: 'dropdownLeveragePopup',
      props: {
        options,
        selected: value,
        onChange: (value: string) => {
          onChangeValue(value);
          modals.setVisible(false);
        },
      },
    });
  };

  return (
    <TouchableOpacity
      style={tw.style(
        'flex-row rounded-lg border-[1px] border-shade2 px-3 py-1 items-center',
        style
      )}
      onPress={onOpen}>
      {value && (
        <Typography size="sm" style="text-secondary2">
          {options.find((x) => x.key === value)?.title}
        </Typography>
      )}

      <ArrowDownSVG style={tw`ml-auto`} width={8} height={8} />
    </TouchableOpacity>
  );
};
