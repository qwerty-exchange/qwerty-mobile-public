import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import type { ClassInput, Style } from 'twrnc/dist/esm/types';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export type TableHeadColumnAlign = 'left' | 'center' | 'right';

export interface TableHeadProps<T> {
  title: string;
  sortInterceptor?: (data: T[]) => T[];
  renderColumn: (data: T) => JSX.Element;
  textStyle?: ClassInput;
  align?: 'left' | 'center' | 'right';
  onPressSort?: () => void;
}

export interface CryptoTableProps<T> {
  tableHeads: Omit<TableHeadProps<T>, 'onPressSort'>[];
  data: T[];
  onPress?: (row: T) => void;
  simpleMode?: boolean;
}

const ALIGN_STYLES: Record<TableHeadColumnAlign, Style> = {
  left: tw`justify-start`,
  center: tw`justify-center`,
  right: tw`justify-end`,
};

const TableHead = <T extends unknown>(props: TableHeadProps<T>) => {
  const align = props.align ?? 'left';

  return (
    <TouchableOpacity
      style={tw.style('flex-1 flex-row items-center', ALIGN_STYLES[align])}
      onPress={props.onPressSort}
      disabled={!props.sortInterceptor}>
      <Typography size="xs" style={['text-secondary2 text-center', props.textStyle]}>
        {props.title}
      </Typography>
    </TouchableOpacity>
  );
};

export const TokenList = <T extends unknown>(props: CryptoTableProps<T>) => {
  const [rows, setRows] = useState<T[]>([]);

  useEffect(() => {
    if (props.data) {
      setRows(props.data);
    }
  }, [props.data]);

  const onSort = (sortInterceptor: (data: T[]) => T[]) => {
    setRows((previous) => [...sortInterceptor(previous)]);
  };

  return (
    <View>
      <View style={tw.style('flex-row mb-1 pb-4', props.simpleMode && 'pb-1')}>
        {props.tableHeads.map((head, index) => (
          <TableHead key={index} {...head} onPressSort={() => onSort(head.sortInterceptor!)} />
        ))}
      </View>

      {rows.map((item, index) => (
        <TouchableOpacity
          disabled={!props.onPress}
          key={index}
          style={tw.style(
            'flex-row py-3',
            !props.simpleMode && 'border-t-2 border-shade1',
            props.simpleMode && 'py-1'
          )}
          onPress={() => props.onPress?.(item)}>
          {props.tableHeads.map((head, index) => (
            <View key={index} style={tw.style('flex-1', index !== 0 && 'ml-3')}>
              {head.renderColumn(item)}
            </View>
          ))}
        </TouchableOpacity>
      ))}
    </View>
  );
};
