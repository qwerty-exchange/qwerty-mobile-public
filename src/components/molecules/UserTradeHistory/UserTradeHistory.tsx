import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { QMarketType } from '@app/common/constants/enum';
import { useMarketMetadata, useUserTradeHistory } from '@app/common/hooks/useExchange';
import useMarketPriceFormatter from '@app/common/hooks/useMarketPriceFormatter';
import tw from '@app/common/tools/tailwind';
import { transformDerivativeTradeUI, transformSpotTradeUI } from '@app/common/transformers/trade';
import { Label, LabelProps } from '@app/components/molecules/Label/Label';
import { Typography } from '@components/atoms/Typography/Typography';

interface UserTradeHistoryProps {
  marketType: QMarketType;
}

export const UserTradeHistory = ({ marketType }: UserTradeHistoryProps) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useUserTradeHistory(marketType);

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
        data={data?.pages.map((page) => page.trades).flat()}
        keyExtractor={(item) => item.tradeId}
        renderItem={({ item }) => <TradeItem trade={item} marketType={marketType} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? renderSpinner : null}
      />
    </View>
  );
};

const TradeItem = ({ trade, marketType }) => {
  const marketFormat = useMarketPriceFormatter(trade.marketId, marketType);
  const tradeUI =
    marketType === QMarketType.SPOT
      ? transformSpotTradeUI(trade, marketFormat)
      : transformDerivativeTradeUI(trade, marketFormat);

  const labels: LabelProps[] = [
    {
      title: 'Type',
      text: tradeUI.tradeExecutionType === 'market' ? 'Market' : 'Limit',
    },
    {
      title: 'Side',
      text: tradeUI.tradeDirection === 'buy' ? 'Buy' : 'Sell',
      valueOptions: {
        style: tradeUI.tradeDirection === 'buy' ? 'text-green' : 'text-danger',
      },
    },
    {
      title: 'Amount',
      text: tradeUI.quantity,
    },
    {
      title: 'Price',
      text: tradeUI.price,
    },
    {
      title: 'Fee',
      text: tradeUI.fee,
    },
    {
      title: 'Date',
      text: new Date(tradeUI.executedAt).toISOString(),
    },
    {
      title: 'Total',
      text: tradeUI.total,
    },
    // {
    //   title: 'Date',
    //   text: new Date(order.createdAt).toISOString(),
    // },
  ];

  const { data: market } = useMarketMetadata(tradeUI.marketId) as any;
  return (
    <View style={tw`border-t-[1px] border-shade2 pt-[18px] pb-4`}>
      <View style={tw`flex-row items-center mb-3`}>
        <Typography size="sm">{market?.ticker}</Typography>
      </View>

      <View style={tw`flex-row`}>
        {labels.map((label, index) => (
          <Label key={index} style={tw`flex-1`} {...label} />
        ))}
      </View>
    </View>
  );
};
