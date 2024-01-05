import { useAccount } from '../../../common/contexts/account';
import { calculateLiquidationPrice } from '../../../common/utils/derivatives';

import { useMemo, useState } from 'react';
import { Platform, View, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {
  MsgIncreasePositionMargin,
  Position,
  derivativeMarginToChainMargin,
  derivativeMarginToChainMarginToFixed,
} from '@injectivelabs/sdk-ts';
import { OrderSide } from '@injectivelabs/ts-types';
import { BigNumber, BigNumberInWei, BigNumberInBase } from '@injectivelabs/utils';

import { Typography } from '@app/components/atoms/Typography/Typography';
import { TextInputSelector } from '@app/components/molecules/Form/TextInputSelector/TextInputSelector';
import { Button } from '@components/atoms/Button/Button';
import { Divider } from '@components/atoms/Divider/Divider';
import { useChainOperation } from '@hooks/useChainOperation';
import {
  useMarketMetadata,
  useUserDerivativePositions,
  useUserAccountBalance,
} from '@hooks/useExchange';
import useMarketPriceFormatter from '@hooks/useMarketPriceFormatter';
import tw from '@tools/tailwind';

import { BaseModalProps, BaseModal } from './components/BaseModal';
import { UseQueryResult } from '@tanstack/react-query';

export interface IncreaseMarginModalProps extends BaseModalProps {
  marketId: string;
}

export const IncreaseMarginModal = ({ onClose, ...props }: IncreaseMarginModalProps) => {
  const insets = useSafeAreaInsets();
  const { injectiveAddress, subaccountId, wallet } = useAccount();

  const [input, setInput] = useState('');

  const marketFormat = useMarketPriceFormatter(props.marketId, 'derivative');

  const { data: position } = useUserDerivativePositions({
    select: (items) => items.find((item) => item.marketId === props.marketId),
  });

  const { data: market } = useMarketMetadata(props.marketId) as any;

  const { data: balance } = useUserAccountBalance();

  const quoteAssetBalance = useMemo(
    () =>
      new BigNumberInWei(
        balance?.coins?.filter(
          (coin) => coin.demon.id === market?.quoteDenom
        )[0]?.availableBalance?.amount
      ).toBase(market?.quoteToken?.decimals),
    [market, balance]
  );

  const accountBalance = useMemo(
    () =>
      Number(
        quoteAssetBalance?.toFixed(
          Math.abs(marketFormat.quantityTensMultiplier),
          BigNumber.ROUND_DOWN
        )
      ),
    [quoteAssetBalance]
  );

  const handleClickPercent = (value: number) => {
    const maxValue = accountBalance;

    const amount = new BigNumberInBase((maxValue * value) / 100).toFixed(
      Math.abs(marketFormat.quantityTensMultiplier),
      BigNumber.ROUND_DOWN
    );

    setInput(amount);
  };

  const liquidationPrice =
    position &&
    calculateLiquidationPrice({
      price: position.entryPrice,
      orderType: position.direction === 'long' ? OrderSide.Buy : OrderSide.Sell,
      market,
      notionalWithLeverage: position.margin,
      quantity: position.quantity,
    });

  const inputChain = derivativeMarginToChainMargin({
    value: input || '0',
    quoteDecimals: market?.quoteToken.decimals,
  });

  const liquidationPriceNew =
    position &&
    calculateLiquidationPrice({
      price: position.entryPrice,
      orderType: position.direction === 'long' ? OrderSide.Buy : OrderSide.Sell,
      market,
      notionalWithLeverage: new BigNumberInBase(position?.margin).plus(inputChain).toString(),
      quantity: position.quantity,
    });

  const handleAddMargin = async () => {
    if (accountBalance < Number(input)) {
      Toast.show({
        type: 'info',
        text1: 'Insufficient available balance',
        position: 'bottom',
      });
      return;
    }

    const msg = MsgIncreasePositionMargin.fromJSON({
      marketId: props.marketId,
      srcSubaccountId: subaccountId,
      dstSubaccountId: subaccountId,
      injectiveAddress,
      amount: derivativeMarginToChainMarginToFixed({
        value: input,
        quoteDecimals: market.quoteToken.decimals,
      }),
    });

    onClose();
    setInput('');
    await wallet.broadcastByToken(msg);
    Toast.show({
      type: 'info',
      text1: 'Margin increased successfully',
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
      useNativeDriver={Platform.OS === 'android'}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          style={tw.style(`px-6 bg-shade1 rounded-t-3xl`, {
            paddingBottom: insets.bottom || 8,
          })}>
          <Typography size="2xl" style={tw`py-4 text-center`}>
            Add margin
          </Typography>
          <View>
            <View style={tw`flex-row justify-between items-center`}>
              <Typography size="sm" style="text-secondary2">
                Current margin
              </Typography>
              <Typography size="sm">{marketFormat.priceFormat(position?.margin)} USDT</Typography>
            </View>
            <View style={tw`flex-row justify-between items-center`}>
              <Typography size="sm" style="text-secondary2">
                Liquidation price
              </Typography>
              <Typography size="sm">
                {marketFormat.priceFormat(liquidationPrice?.toFixed())} USDT
              </Typography>
            </View>
            <View style={tw`flex-row justify-between items-center`}>
              <Typography size="sm" style="text-secondary2">
                Mark price
              </Typography>
              <Typography size="sm">
                {marketFormat.priceFormat(position?.markPrice)} USDT
              </Typography>
            </View>
            <Divider />
          </View>
          <Typography size="xs" style="text-secondary2 text-right mr-2">
            Available balance: {accountBalance} USDT
          </Typography>
          <TextInputSelector
            mode="percent"
            value={input}
            onChange={(value) => setInput(value)}
            percents={[25, 50, 75, 100]}
            onClickPercent={handleClickPercent}
            style={tw`mb-4`}
            stylePercent="mt-4 mx-2 bg-shade2"
            styleInput="text-white text-center bg-shade2 h-12"
            keyboardType="decimal-pad"
            precision={marketFormat.quantityTensMultiplier}
            placeholder="Market price"
            autoFocus
          />

          <Typography size="sm" style="text-center text-secondary2">
            Estimation Liquidation Price after increase
          </Typography>
          <Typography size="sm" style={tw`pb-4 text-center`}>
            {marketFormat.priceFormat(liquidationPriceNew?.toFixed())} USDT
          </Typography>
          <Button style={tw`p-4 rounded-xl mb-2`} onPress={chainOperation}>
            <Typography style="text-background font-demiBold">Add margin</Typography>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </BaseModal>
  );
};
