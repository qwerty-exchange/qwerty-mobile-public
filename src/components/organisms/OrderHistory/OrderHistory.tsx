import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { QMarketType } from '@app/common/constants/enum';
import { useMarketMetadata, useUserOrderHistory } from '@app/common/hooks/useExchange';
import useMarketPriceFormatter from '@app/common/hooks/useMarketPriceFormatter';
import tw from '@app/common/tools/tailwind';
import { transformSpotOrderHistoryUI } from '@app/common/transformers/trade';
import { Label, LabelProps } from '@app/components/molecules/Label/Label';
import { Typography } from '@components/atoms/Typography/Typography';

interface OrderHistoryProps {
  marketType: QMarketType;
}

export const OrderHistory = ({ marketType }: OrderHistoryProps) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useUserOrderHistory(marketType);

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
        data={data?.pages.map((page) => page.orderHistory).flat()}
        keyExtractor={(item) => item.orderHash}
        renderItem={(item) => <OrderItem item={item.item} marketType={marketType} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? renderSpinner : null}
      />
    </View>
  );
};

const OrderItem = ({ item, marketType }) => {
  const order = item;
  const marketFormat = useMarketPriceFormatter(order.marketId, marketType);
  const tradeUI = transformSpotOrderHistoryUI(order, marketFormat);
  const labels: LabelProps[] = [
    {
      title: 'Type',
      text: tradeUI.executionType === 'limit' ? 'Limit' : 'Market',
    },
    {
      title: 'Side',
      text: tradeUI.direction === 'buy' ? 'Buy' : 'Sell',
      valueOptions: {
        style: tradeUI.direction === 'buy' ? 'text-green' : 'text-danger',
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
      title: 'Total',
      text: tradeUI.total,
    },
    {
      title: 'Status',
      text: tradeUI.state,
    },
    {
      title: 'Date',
      text: new Date(order.createdAt).toISOString(),
    },
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
