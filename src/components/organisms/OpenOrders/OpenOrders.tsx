import { CardOrder } from '../CardOrder/CardOrder';

import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Toast from 'react-native-toast-message';

import { MsgBatchCancelDerivativeOrders, MsgBatchCancelSpotOrders } from '@injectivelabs/sdk-ts';

import { QMarketType } from '@app/common/constants/enum';
import { useAccount } from '@app/common/contexts/account';
import { useChainOperation } from '@app/common/hooks/useChainOperation';
import { Button } from '@app/components/atoms/Button/Button';
import { Spinner } from '@app/components/atoms/Spinner/Spinner';
import { Typography } from '@app/components/atoms/Typography/Typography';
import { CheckBox } from '@app/components/molecules/Form/CheckBox/CheckBox';
import { IconOrders } from '@assets/icons';
import { useUserActiveOrders } from '@hooks/useExchange';
import tw from '@tools/tailwind';

export interface OpenOrdersTabProps {
  marketId: string;
  marketType: QMarketType;
  onContentHeight: (height: number, key: string) => void;
}

export const OpenOrders = ({ marketId, marketType, onContentHeight }: OpenOrdersTabProps) => {
  const onLayout = (event: LayoutChangeEvent) => {
    onContentHeight(event.nativeEvent.layout.height, 'ORDERS');
  };

  const { wallet, injectiveAddress } = useAccount();
  const { data: userOrders, isLoading } = useUserActiveOrders(marketType);

  const close = useChainOperation(async (orders: any[]) => {
    if (orders.length === 0) {
      return;
    }
    const messages = orders.map((order) => {
      const args = {
        injectiveAddress,
        orders: [
          {
            marketId: order.marketId,
            subaccountId: order.subaccountId,
            orderHash: order.orderHash,
          },
        ],
      };
      return marketType === QMarketType.SPOT
        ? MsgBatchCancelSpotOrders.fromJSON(args)
        : MsgBatchCancelDerivativeOrders.fromJSON(args);
    });
    const log = await wallet.broadcastByToken(messages);
    Toast.show({
      type: 'info',
      text1: 'Orders cancelled',
      position: 'bottom',
    });
  });

  const [hideOtherPairs, setHideOtherPairs] = useState(false);

  if (isLoading) {
    return (
      <View style={tw`w-full bg-background h-48 justify-center items-center`}>
        <Spinner color={tw.color('primary')} />
      </View>
    );
  }

  return (
    <View style={tw`w-full bg-background px-4`} onLayout={onLayout}>
      {userOrders?.length > 0 ? (
        <View style={tw`flex-row py-5 items-center`}>
          <CheckBox
            selected={hideOtherPairs}
            onPress={() => setHideOtherPairs(!hideOtherPairs)}
            title="Hide other pairs"
            typography="xs"
          />
          <Button
            style={tw`ml-auto bg-shade2 py-1 px-2.5 rounded-[4px]`}
            onPress={async () => await close(userOrders)}>
            <Typography style="text-secondary2" size="sm">
              Cancel all
            </Typography>
          </Button>
        </View>
      ) : (
        <View style={tw`w-full h-48 bg-background justify-center items-center`} onLayout={onLayout}>
          <IconOrders stroke={tw.color(`tertiary`)} />
          <Typography style="text-tertiary p-2" size="xs">
            No open orders
          </Typography>
        </View>
      )}

      {userOrders
        ?.filter((x) => !hideOtherPairs || x.marketId === marketId)
        ?.map((order) => (
          <CardOrder
            key={order.orderHash}
            marketType={marketType}
            order={order}
            onClickClose={async (x) => await close([x])}
          />
        ))}
    </View>
  );
};
