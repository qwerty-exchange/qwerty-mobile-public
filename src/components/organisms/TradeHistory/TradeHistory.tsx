import { View } from 'react-native';

import { QMarketType } from '@app/common/constants/enum';
import { TokenList } from '@app/components/organisms/TokenList/TokenList';
import { Typography } from '@components/atoms/Typography/Typography';
import { useTrades } from '@hooks/useExchange';
import useMarketPriceFormatter from '@hooks/useMarketPriceFormatter';
import { formatDate } from '@tools/date';
import tw from '@tools/tailwind';

export interface TradeHistoryPageProps {
  marketId: string;
  marketType: QMarketType;
}

// TODO: Refactor
export const TradeHistory = ({ marketId, marketType }: TradeHistoryPageProps) => {
  const { data, isLoading } = useTrades(marketId, marketType);

  const formatter = useMarketPriceFormatter(marketId, marketType);
  const trades = !isLoading
    ? data
        .map((x: any) => ({
          time: formatDate(new Date(x.executedAt), 'verboseTime'),
          quantity: formatter.quantityFormat(x.quantity || x.executionQuantity),
          price: {
            title: formatter.priceFormat(x.price || x.executionPrice),
            color: x.tradeDirection === 'buy' ? 'text-green' : 'text-danger',
          },
        }))
        .slice(0, 10)
    : [];

  const tableHeads: any = [
    {
      title: 'Time',
      textStyle: tw`text-tertiary`,
      renderColumn: (item) => <Typography size="xs">{item.time}</Typography>,
    },
    {
      title: 'Price',
      textStyle: tw`flex-1 text-center text-tertiary`,
      renderColumn: (item) => (
        <Typography style={['text-center', item.price.color]} size="xs">
          {item.price.title}
        </Typography>
      ),
    },
    {
      title: 'Quantity',
      textStyle: tw`text-tertiary flex-1 text-right`,
      renderColumn: (item) => (
        <Typography style={tw`text-right`} size="xs">
          {item.quantity}
        </Typography>
      ),
    },
  ];

  return (
    <View style={tw`h-full w-full px-4 pb-2 my-2`}>
      <TokenList simpleMode tableHeads={tableHeads} data={trades} />
    </View>
  );
};
