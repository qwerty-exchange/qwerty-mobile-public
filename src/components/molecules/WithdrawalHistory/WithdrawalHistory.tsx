import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { UiBridgeTransactionWithToken, getNetworkFromAddress } from '@injectivelabs/sdk-ui-ts';
import { BigNumberInWei } from '@injectivelabs/utils';

import { useUserWithdrawalHistory } from '@app/common/hooks/useExchange';
import { formatDate } from '@app/common/tools/date';
import tw from '@app/common/tools/tailwind';
import { Typography } from '@components/atoms/Typography/Typography';

interface WithdrawalHistoryProps {}

export const WithdrawalHistory = () => {
  const { data } = useUserWithdrawalHistory();

  return (
    <View style={tw`flex-1`}>
      <FlatList
        data={data}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => <WithdrawalItem item={item} />}
      />
    </View>
  );
};

const WithdrawalItem = ({ item }: { item: UiBridgeTransactionWithToken }) => {
  const amountFormat = new BigNumberInWei(item.amount).toBase(item.token.decimals);

  return (
    <View style={tw`border-t-[1px] border-shade2 pt-[18px] pb-4`}>
      <View style={tw`flex-row justify-between`}>
        <Typography>
          {item.token.symbol} ({getNetworkFromAddress(item.token.name)})
        </Typography>
        <Typography>{formatDate(new Date(item.timestamp), 'dateTime')}</Typography>
      </View>
      <View style={tw`flex-row justify-between`}>
        <Typography>
          {amountFormat.isGreaterThan(0.01) ? amountFormat.toFixed(2, 0) : '< 0.01'}
        </Typography>
        <Typography>{item.state}</Typography>
      </View>
    </View>
  );
};
