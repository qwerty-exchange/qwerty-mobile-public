import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useUserAccountBalance } from '@app/common/hooks/useExchange';
import { CryptoCoin } from '@app/components/molecules/CryptoCoin/CryptoCoin';
import { CurrencyRow } from '@app/components/molecules/CurrencyRow/CurrencyRow';
import { TextInput } from '@app/components/molecules/Form/TextInput/TextInput';
import { BalanceWidget } from '@app/components/organisms/BalanceWidget/BalanceWidget';
import { TokenList, type TableHeadProps } from '@app/components/organisms/TokenList/TokenList';
import { SearchSVG } from '@assets/icons';
import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

// TODO: Refactor
export const PortfolioTemplate = () => {
  const [filter, setFilter] = useState('');

  const tableHeads: Omit<TableHeadProps<any>, 'onPressSort'>[] = [
    {
      title: 'Asset',
      sortInterceptor: (rows) => rows.sort((a, b) => a.demon.name.localeCompare(b.demon.name)),
      renderColumn: (item) => <CryptoCoin cryptoCoin={item.demon.name} />,
    },
    {
      title: 'Available',
      textStyle: tw`flex-1 text-left`,
      renderColumn: (item) => (
        <CurrencyRow
          value={item.availableBalance.formatAmount}
          onUSD={item.availableBalance.formatUsd}
        />
      ),
    },
    {
      title: 'Hold',
      textStyle: tw`text-tertiary flex-1 text-left`,
      renderColumn: (item) => (
        <View style={tw`flex-1 justify-center`}>
          <Typography size="xs" style="text-tertiary">
            {item.lockedBalance ? item.lockedBalance.formatAmount : '-'}
          </Typography>
        </View>
      ),
    },

    {
      title: 'Total',
      textStyle: tw`flex-1 text-left`,
      renderColumn: (item) => (
        <CurrencyRow value={item.totalBalance.formatAmount} onUSD={item.totalBalance.formatUsd} />
      ),
    },
  ];

  const [balanceData, setBalanceData] = useState([]);
  const { data, error } = useUserAccountBalance();

  if (!error) {
    if (data && data.coins && data.coins != balanceData) {
      setBalanceData(data.coins);
    }
  }

  const filterBalanceData = useMemo(
    () =>
      balanceData.filter((x) =>
        x.demon.name.toLowerCase().includes(filter ? filter.toLowerCase() : '')
      ),
    [filter, balanceData]
  );

  return (
    <ScrollView style={tw`flex-1 px-4`}>
      <BalanceWidget balance={data?.summary?.totalBalance} />

      <Typography size="xl" style={tw`text-xl font-demiBold mt-10 mb-5`}>
        Balances
      </Typography>

      <View style={tw`flex-row items-center mb-5`}>
        <View style={tw`flex-1`}>
          <TextInput
            value={filter}
            onChangeText={setFilter}
            icon={{ svg: SearchSVG }}
            placeholder="Search for asset"
          />
        </View>
      </View>

      <TokenList tableHeads={tableHeads} data={filterBalanceData} />
    </ScrollView>
  );
};
