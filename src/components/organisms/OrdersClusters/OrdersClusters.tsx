import { memo } from 'react';
import { TouchableHighlight, View } from 'react-native';

import { rgba } from 'polished';

import { Typography } from '@components/atoms/Typography/Typography';
import tw from '@tools/tailwind';

export interface OrderProps {
  title: string;
  value: string;
  percent: number;
}

export interface OrderBookProps {
  orders: OrderProps[];
  variant: 'buy' | 'sell';
  percentAlign?: 'left' | 'right';
  valueAlign?: 'left' | 'right';
  onClick;
}

export interface OrderBookRowProps extends Omit<OrderBookProps, 'orders'> {
  order: OrderProps;
}

export const OrderElement = ({
  order,
  variant,
  percentAlign = 'left',
  valueAlign = 'left',
  onClick,
}: OrderBookRowProps) => {
  return (
    <TouchableHighlight onPress={() => onClick(order.title)}>
      <View style={tw`flex-row py-1`}>
        <View style={tw`flex-1`}>
          {valueAlign === 'left' && (
            <Typography
              size="xs"
              style={[
                tw.style({ textAlign: valueAlign }),
                variant === 'buy' ? 'text-green' : 'text-danger',
              ]}>
              {order.value}
            </Typography>
          )}

          {valueAlign === 'right' && (
            <Typography size="xs" style={tw`text-left`}>
              {order.title}
            </Typography>
          )}
        </View>

        <View style={tw`flex-1`}>
          {valueAlign === 'left' && (
            <Typography size="xs" style={tw`text-right`}>
              {order.title}
            </Typography>
          )}

          {valueAlign === 'right' && (
            <Typography
              size="xs"
              style={[
                tw.style({ textAlign: valueAlign }),
                variant === 'buy' ? 'text-green' : 'text-danger',
              ]}>
              {order.value}
            </Typography>
          )}
        </View>

        <View
          style={tw.style(
            `absolute top-0 bottom-0`,
            {
              width: `${order.percent}%`,
              backgroundColor: rgba(tw.color(variant === 'buy' ? 'green' : 'danger'), 0.15),
            },
            percentAlign === 'right' && 'right-0'
          )}
        />
      </View>
    </TouchableHighlight>
  );
};

export const OrdersClusters = memo(
  ({ orders, variant, percentAlign = 'left', valueAlign = 'left', onClick }: OrderBookProps) => {
    return (
      <View>
        {orders.map((order, index) => (
          <OrderElement
            onClick={onClick}
            key={index}
            order={order}
            percentAlign={percentAlign}
            variant={variant}
            valueAlign={valueAlign}
          />
        ))}
      </View>
    );
  }
);
