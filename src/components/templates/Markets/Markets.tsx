import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { useNavigation, useRouter } from 'expo-router';

import { useHeaderSearch } from '@app/common/hooks/useHeaderSearch';
import { CryptoCoin } from '@app/components/molecules/CryptoCoin/CryptoCoin';
import { Percent } from '@app/components/molecules/Percent/Percent';
import { Price } from '@app/components/molecules/Price/Price';
import { TokenList, type TableHeadProps } from '@app/components/organisms/TokenList/TokenList';
import { TopBar, type TopTabProps } from '@components/organisms/TopBar/TopBar';
import { useMarkets } from '@hooks/useExchange';
import tw from '@tools/tailwind';

// TODO: Refactor
export const Markets = () => {
  const navigation = useNavigation();

  const { searchText } = useHeaderSearch(navigation as any);

  const router = useRouter();
  const onSelectRow = (row: any, type: string) => {
    router.push({ pathname: `/markets/${type}/[id]`, params: { id: row.id, market: row } });
  };

  const buildMarketPage = useCallback(
    (type: string) => (
      <MarketsPage
        filter={{ marketName: searchText }}
        onSelectRow={(item) => onSelectRow(item, type)}
        type={type}
      />
    ),
    [searchText]
  );

  const topBarTabs: TopTabProps[] = useMemo(
    () =>
      [
        {
          title: 'Spot',
          component: () => buildMarketPage('spot'),
        },
        {
          title: 'Futures',
          component: () => buildMarketPage('derivative'),
        },
      ] as any,
    [searchText]
  );

  return (
    <View style={tw`flex-1`}>
      {/* {<SpotPage onSelectRow={onSelectRow}  />} */}
      <TopBar tabs={topBarTabs} />
    </View>
  );
};

export interface MarketsPageProps {
  onSelectRow: (row: any) => void;
  filter?: { marketName: string };
}

const MarketsPage = ({ onSelectRow, filter, type }) => {
  const { data } = useMarkets();

  const tableHeads: Omit<TableHeadProps<any>, 'onPressSort'>[] = [
    {
      title: 'Name / Vol',
      sortInterceptor: (data) => data,
      renderColumn: (row) => <CryptoCoin cryptoCoin={row.name} subtitle={row.volumeFormat} />,
    },
    {
      title: 'Price',
      sortInterceptor: (data) => data,
      textStyle: tw`text-center`,
      renderColumn: (row) => (
        <View style={tw`flex-1 justify-center`}>
          <Price price={row.price} currency={row.name.split(' ')[0].split('/')[1]} />
        </View>
      ),
    },
    {
      title: 'Change (24H)',
      sortInterceptor: (data) => data,
      textStyle: tw`text-right`,
      align: 'right',
      renderColumn: (row) => (
        <View style={tw`flex-1 justify-center`}>
          <Percent percent={row.priceChange} style={tw`text-right`} />
        </View>
      ),
    },
  ];

  return (
    <ScrollView style={tw`flex-1 bg-background px-4 pt-6`}>
      <TokenList
        tableHeads={tableHeads}
        data={
          data &&
          data[type]?.filter((x) =>
            x.name
              .toLowerCase()
              .includes(filter?.marketName ? filter?.marketName.toLowerCase() : '')
          )
        }
        onPress={onSelectRow}
      />
    </ScrollView>
  );
};
