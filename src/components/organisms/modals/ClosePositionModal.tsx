import { useAccount } from '../../../common/contexts/account';

import { useEffect, useState } from 'react';
import { Platform, View, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {
  MsgCreateDerivativeLimitOrder,
  MsgCreateDerivativeMarketOrder,
  Position,
  derivativePriceToChainPriceToFixed,
  derivativeQuantityToChainQuantityToFixed,
} from '@injectivelabs/sdk-ts';
import { orderSideToOrderType } from '@injectivelabs/sdk-ui-ts';
import { OrderSide } from '@injectivelabs/ts-types';
import { BigNumber, BigNumberInBase } from '@injectivelabs/utils';

import { QMarketType } from '@app/common/constants/enum';
import { Typography } from '@app/components/atoms/Typography/Typography';
import { ColumnTab } from '@app/components/molecules/ColumnTab/ColumnTab';
import { TextInputSelector } from '@app/components/molecules/Form/TextInputSelector/TextInputSelector';
import { Button } from '@components/atoms/Button/Button';
import { Divider } from '@components/atoms/Divider/Divider';
import { useChainOperation } from '@hooks/useChainOperation';
import {
  useMarketMetadata,
  useUserActiveOrders,
  useUserDerivativePositions,
} from '@hooks/useExchange';
import useMarketPriceFormatter from '@hooks/useMarketPriceFormatter';
import tw from '@tools/tailwind';

import { BaseModal, BaseModalProps } from './components/BaseModal';

export interface ClosePositionModalProps extends BaseModalProps {
  marketId: string;
}

export const ClosePositionModal = ({ onClose, ...props }: ClosePositionModalProps) => {
  const insets = useSafeAreaInsets();
  const { injectiveAddress, subaccountId, wallet } = useAccount();

  const [orderType, setOrderType] = useState('Limit');

  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  const marketFormat = useMarketPriceFormatter(props.marketId, 'derivative');

  const { data: position } = useUserDerivativePositions({
    select: (items) => items.find((item) => item.marketId === props.marketId),
  });

  const { data: market } = useMarketMetadata(props.marketId) as any;

  useEffect(() => {
    if (props.visible) {
      setPrice(marketFormat.priceFormat(position?.markPrice));
    }
  }, [props.visible]);

  const { data: userOrders } = useUserActiveOrders(QMarketType.DERIVATIVE);

  const unfilledQuantity = userOrders
    ?.filter((x) => x.isReduceOnly && x.marketId === props.marketId)
    .reduce((a, b) => a.plus(new BigNumberInBase(b.unfilledQuantity)), new BigNumberInBase(0));

  const positionSize = Number(
    marketFormat?.quantityFormat(new BigNumberInBase(position?.quantity).minus(unfilledQuantity))
  );

  const handleClickPercent = (value: number) => {
    const maxValue = positionSize;

    const amount = new BigNumberInBase((maxValue * value) / 100).toFixed(
      Math.abs(marketFormat.quantityTensMultiplier),
      BigNumber.ROUND_DOWN
    );

    setAmount(amount);
  };

  const handleAddMargin = async () => {
    if (positionSize < Number(amount)) {
      Toast.show({
        type: 'info',
        text1: 'Insufficient available balance',
        position: 'bottom',
      });
      return;
    }

    onClose();
    setOrderType('Limit');
    setAmount('');

    const args = {
      injectiveAddress,
      subaccountId,
      orderType: orderSideToOrderType(
        position.direction === 'long' ? OrderSide.Sell : OrderSide.Buy
      ),
      marketId: props.marketId,
      feeRecipient: 'inj1xefevqpwr97me59jmkg8mf5auqcf5vgtz7kc85',
      price: derivativePriceToChainPriceToFixed({
        value:
          orderType === 'Limit'
            ? price
            : position.direction === 'long'
            ? (parseFloat(price) * 0.9).toFixed(2)
            : (parseFloat(price) * 1.1).toFixed(2),
        quoteDecimals: market.quoteToken.decimals,
      }),
      quantity: derivativeQuantityToChainQuantityToFixed({
        value: amount,
      }),
      margin: '0',
    };

    const message =
      orderType === 'Limit'
        ? MsgCreateDerivativeLimitOrder.fromJSON(args)
        : MsgCreateDerivativeMarketOrder.fromJSON(args);

    await wallet.broadcastByToken(message);

    Toast.show({
      type: 'info',
      text1: 'Transaction submitted',
      position: 'bottom',
    });
  };

  const chainOperation = useChainOperation(handleAddMargin);
  return (
    <BaseModal
      {...props}
      swipeDirection={['down']}
      style={tw`justify-end m-0`}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      backdropTransitionOutTiming={0}
      avoidKeyboard
      useNativeDriver={Platform.OS === 'android'}>
      <View
        style={tw.style(`px-6 bg-shade1 rounded-t-3xl`, {
          paddingBottom: insets.bottom || 8,
        })}>
        <Typography size="2xl" style={tw`py-4 text-center`}>
          Close Position
        </Typography>
        <View>
          <View style={tw`flex-row justify-between items-center`}>
            <Typography size="sm" style="text-secondary2">
              Symbol
            </Typography>
            <Typography size="sm">{position?.ticker}</Typography>
          </View>
          <View style={tw`flex-row justify-between items-center`}>
            <Typography size="sm" style="text-secondary2">
              Entry price
            </Typography>
            <Typography size="sm">{marketFormat.priceFormat(position?.entryPrice)} USDT</Typography>
          </View>
          <View style={tw`flex-row justify-between items-center`}>
            <Typography size="sm" style="text-secondary2">
              Mark price
            </Typography>
            <Typography size="sm">{marketFormat.priceFormat(position?.markPrice)} USDT</Typography>
          </View>
          <Divider />
        </View>
        <View style={tw`ml-2 mb-4`}>
          <ColumnTab
            type="simple"
            columns={['Limit', 'Market']}
            value={orderType}
            onChange={setOrderType}
          />
        </View>
        <Typography size="sm" style="text-secondary2 ml-2">
          Price
        </Typography>
        {orderType === 'Limit' ? (
          <TextInputSelector
            mode="default"
            value={price}
            onChange={(value) => setPrice(value)}
            style={tw`mb-6`}
            styleInput="text-white text-center bg-shade2 h-12"
            keyboardType="decimal-pad"
            precision={marketFormat.quantityTensMultiplier}
            placeholder="Price"
            autoFocus
          />
        ) : (
          <TextInputSelector
            precision={marketFormat.priceTensMultiplier}
            value="Market"
            mode="default"
            style={tw`mb-6 `}
            styleInput="text-white text-center bg-shade2 h-12 text-tertiary"
            placeholder="Market price"
            disabled
          />
        )}
        <View style={tw`flex-row justify-between items-center mx-2`}>
          <Typography size="sm" style="text-secondary2">
            Amount
          </Typography>
          <Typography size="xs" style="text-secondary2">
            Available: {positionSize.toFixed(Math.abs(marketFormat.quantityTensMultiplier))}{' '}
            {market?.ticker.split('/')[0]}
          </Typography>
        </View>
        <TextInputSelector
          mode="percent"
          value={amount}
          onChange={(value) => setAmount(value)}
          percents={[25, 50, 75, 100]}
          onClickPercent={handleClickPercent}
          style={tw`mb-4`}
          stylePercent="mt-4 mx-2 bg-shade2"
          styleInput="text-white text-center bg-shade2 h-12"
          keyboardType="decimal-pad"
          precision={marketFormat.quantityTensMultiplier}
          placeholder="Position size"
          autoFocus
        />

        <Button style={tw`p-4 rounded-xl mb-2`} onPress={chainOperation}>
          <Typography style="text-background font-demiBold">Confirm</Typography>
        </Button>
      </View>
    </BaseModal>
  );
};
