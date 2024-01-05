import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { DerivativeMarket, FundingPayment } from '@injectivelabs/sdk-ts';
import { BigNumberInWei } from '@injectivelabs/utils';

import { UseQueryResult } from '@tanstack/react-query';

import { useMarketMetadata, useUserFundingPaymentHistory } from '@app/common/hooks/useExchange';
import { formatDate } from '@app/common/tools/date';
import tw from '@app/common/tools/tailwind';
import { Divider } from '@app/components/atoms/Divider/Divider';
import { Typography, NumberValue } from '@app/components/atoms/Typography/Typography';

interface FundingPaymentHistoryProps {}

export const FundingPaymentHistory = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useUserFundingPaymentHistory();

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderSpinner = () => {
    return (
      <View style={tw`w-full bg-background h-16 justify-center items-center`}>
        <Typography style="text-tertiary">Loading...</Typography>
      </View>
    );
  };
  return (
    <View style={tw`flex-1`}>
      <FlatList
        data={data?.pages.map((page) => page.fundingPayments).flat()}
        keyExtractor={(item) => item.timestamp.toString() + item.marketId + item.subaccountId}
        renderItem={({ item }) => <FundingPaymentItem item={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <Divider />}
        ListFooterComponent={isFetchingNextPage ? renderSpinner : null}
      />
    </View>
  );
};

const FundingPaymentItem = ({ item }: { item: FundingPayment }) => {
  const { data: market } = useMarketMetadata(item.marketId) as UseQueryResult<DerivativeMarket>;
  return (
    <View style={tw`pt-[18px] pb-4`}>
      <View style={tw`flex-row justify-between`}>
        <Typography>{market.ticker}</Typography>
        <Typography>{formatDate(new Date(item.timestamp), 'dateTime')}</Typography>
      </View>
      <View style={tw`flex-row justify-between`}>
        <NumberValue
          value={new BigNumberInWei(item.amount).toBase(market.quoteToken.decimals).toFixed(6)}
        />
      </View>
    </View>
  );
};
