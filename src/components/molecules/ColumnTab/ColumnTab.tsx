import { TouchableOpacity, View } from 'react-native';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export type ColumnTabType = 'simple' | 'border';

export interface ColumnTabProps {
  type?: ColumnTabType;
  columns: string[];
  value?: string;
  onChange?: (orderType: string) => void;
}

export const ColumnTab = ({ columns, value, onChange, type = 'border' }: ColumnTabProps) => {
  const onPress = (orderType) => {
    onChange(orderType);
  };

  return (
    <View
      style={tw.style('flex-row rounded-lg mb-1', type === 'border' && 'border-shade2 border-2')}>
      {columns.map((column, index) => (
        <TouchableOpacity
          key={index}
          style={tw.style(
            'items-center justify-center ',
            value === column &&
              type === 'border' && {
                backgroundColor: tw.color('shade2'),
              },
            type === 'border' && 'flex-1 py-2',
            type === 'simple' && 'mr-4'
          )}
          onPress={() => onPress(column)}>
          <Typography size="sm" style={value === column ? 'text-primary' : 'text-tertiary'}>
            {column}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};
