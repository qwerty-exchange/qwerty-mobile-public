import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

import {
  MsgCreateDerivativeLimitOrder,
  MsgCreateDerivativeMarketOrder,
  derivativePriceToChainPriceToFixed,
  derivativeQuantityToChainQuantityToFixed,
} from '@injectivelabs/sdk-ts';
import {
  UiExpiryFuturesMarketWithToken,
  UiPerpetualMarketWithToken,
  orderSideToOrderType,
} from '@injectivelabs/sdk-ui-ts';
import { OrderSide } from '@injectivelabs/ts-types';
import { BigNumberInBase, BigNumberInWei } from '@injectivelabs/utils';

import { QMarketType } from '@app/common/constants/enum';
import { useAccount } from '@app/common/contexts/account';
import { calculateMargin } from '@app/common/utils/derivatives';
import {
  PurchaseButton,
  PurchaseType,
} from '@app/components/atoms/Button/PurchaseButton/PurchaseButton';
import { ColumnTab } from '@app/components/molecules/ColumnTab/ColumnTab';
import { Dropdown } from '@app/components/molecules/Form/Dropdown/Dropdown';
import { PurchaseTypeSwitcher } from '@app/components/organisms/PurchaseTypeSwitcher/PurchaseTypeSwitcher';
import { MinusSVG, PlusSVG } from '@assets/icons';
import { Button } from '@components/atoms/Button/Button';
import { Typography } from '@components/atoms/Typography/Typography';
import { useChainOperation } from '@hooks/useChainOperation';
import {
  useUserAccountBalance,
  useMarketMetadata,
  useOrderBooks,
  useMarketSummary,
} from '@hooks/useExchange';
import useMarketPriceFormatter from '@hooks/useMarketPriceFormatter';
import type { CryptoOperationType } from '@models/crypto';
import tw from '@tools/tailwind';

export interface LeftColumnProps {
  marketId?: string;
  marketType: QMarketType;
  operationType: CryptoOperationType;
  values;
  handleChange;
}

export const PurchaseForm = ({ marketId, marketType, values, handleChange }: LeftColumnProps) => {
  const { data: market } = useMarketMetadata(marketId);
  const { data: balance } = useUserAccountBalance();
  const { data: marketSummary } = useMarketSummary(marketId);

  const baseAsset = useMemo(() => market?.ticker.split('/')[0] || '', [market]);
  const quoteAsset = useMemo(
    () => market?.ticker?.split('/')[1].replace(' PERP', '') || '',
    [market]
  );

  const quoteAssetBalance = useMemo(
    () =>
      new BigNumberInWei(
        balance?.coins?.filter(
          (coin) => coin.demon.id === market.quoteDenom
        )[0]?.availableBalance?.amount
      ),
    [balance]
  );

  const accountBalance = useMemo(
    () =>
      Number(quoteAssetBalance.toBase(market?.quoteToken.decimals)?.toFixed()) *
      (Number(values.leverage) * 0.99),
    [values.operationType, quoteAssetBalance, values.leverage]
  );

  const formater = useMarketPriceFormatter(marketId, marketType);

  const { data: orderBook } = useOrderBooks(marketId, marketType);

  const maxLeverage = getMaxLeverageFromMarket(market);

  const { wallet, injectiveAddress, subaccountId } = useAccount();
  const handleCreateOrder = async () => {
    const amount = Number(values.amount);
    if (isNaN(amount)) {
      return;
    }

    const price =
      values.orderType === 'Limit'
        ? derivativePriceToChainPriceToFixed({
            value: values.price,
            quoteDecimals: market.quoteToken.decimals,
          })
        : derivativePriceToChainPriceToFixed({
            value:
              values.operationType === 'Buy'
                ? parseFloat((marketSummary.price * 1.005).toFixed(2))
                : parseFloat((marketSummary.price * 0.995).toFixed(2)),
            quoteDecimals: market.quoteToken.decimals,
          });

    const margin = new BigNumberInBase(
      calculateMargin({
        leverage: values.leverage,
        price,
        quantity: derivativeQuantityToChainQuantityToFixed({
          value: values.amount,
        }),
        tensMultiplier: formater.quantityTensMultiplier,
        quoteTokenDecimals: market.quoteToken.decimals,
      }).toFixed(market.minQuantityTickSize.toString().length - 2)
    );

    if (margin.isGreaterThan(quoteAssetBalance.times(Number(values.leverage)))) {
      Toast.show({
        type: 'info',
        text1: 'Insufficient available balance',
        position: 'bottom',
      });
      return;
    }

    const args = {
      injectiveAddress,
      subaccountId,
      orderType: orderSideToOrderType(
        values.operationType === 'Buy' ? OrderSide.Buy : OrderSide.Sell
      ),
      marketId,
      feeRecipient: 'inj1xefevqpwr97me59jmkg8mf5auqcf5vgtz7kc85',
      price,
      quantity: derivativeQuantityToChainQuantityToFixed({
        value: values.amount,
      }),
      margin: margin.toFixed(),
    };

    const message =
      values.orderType === 'Limit'
        ? MsgCreateDerivativeLimitOrder.fromJSON(args)
        : MsgCreateDerivativeMarketOrder.fromJSON(args);

    const response = await wallet.broadcastByToken(message);

    if (response.code !== 0) {
      Toast.show({
        type: 'info',
        text1: 'Unable to create order. Code ' + response.code,
        position: 'bottom',
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Order created',
      position: 'bottom',
    });
  };

  const chainOperation = useChainOperation(handleCreateOrder);

  useEffect(() => {
    const price = formater.priceFormat(
      values.operationType === 'Buy' ? orderBook?.sells[0].price : orderBook?.buys[0].price
    ) as string;

    handleChange('price')(price);
  }, [values.operationType]);

  return (
    <View style={tw`w-3/5 pr-4`}>
      <PurchaseTypeSwitcher
        value={values.operationType}
        onChange={(value) => {
          handleChange('operationType')(value);
        }}
      />

      <View style={tw`flex-row justify-between items-center mb-4`}>
        <ColumnTab
          type="simple"
          columns={['Limit', 'Market']}
          value={values.orderType}
          onChange={(value) => handleChange('orderType')(value)}
        />
        <FuturesLeveragePicker
          currentValue={values.leverage}
          onChange={(value) => handleChange('leverage')(value)}
          maxLeverage={maxLeverage}
        />
      </View>

      <CurrencyInputWithControllers
        precision={formater.priceTensMultiplier}
        inputLabel="Price"
        value={values.orderType !== 'Limit' ? 'Market' : values.price}
        disabled={values.orderType !== 'Limit'}
        onChange={(value) => {
          handleChange('price')(value);

          if (!value || !values.amount) {
            handleChange('total')('0');
          } else {
            handleChange('total')((parseFloat(values.amount) * parseFloat(value)).toString());
          }
        }}
        withControlers
      />

      <CurrencyInputWithControllers
        precision={formater.quantityTensMultiplier}
        inputLabel="Amount"
        withRange
        value={values.amount}
        onChange={(value) => {
          handleChange('amount')(value);
          if (!value || !values.price) {
            handleChange('total')('0');
          } else {
            handleChange('total')((parseFloat(value) * parseFloat(values.price)).toString());
          }
        }}
        balance={new BigNumberInBase(accountBalance / parseFloat(values.price)).toFixed(
          Math.abs(formater.quantityTensMultiplier),
          BigNumberInBase.ROUND_DOWN
        )}
        placeholder={`Amount (${baseAsset})`}
        currencyLabel={baseAsset}
        disabled={false}
        displayBalance={values.orderType === 'Market'}
        withControlers
      />
      {values.orderType === 'Limit' && (
        <CurrencyInputWithControllers
          precision={formater.quantityTensMultiplier}
          inputLabel="Total"
          value={parseFloat(values.total)?.toFixed(2)}
          balance={new BigNumberInBase(accountBalance).toFixed(
            Math.abs(formater.quantityTensMultiplier),
            BigNumberInBase.ROUND_DOWN
          )}
          onChange={(value) => {
            handleChange('total')(value);
          }}
          disabled={true}
          currencyLabel={quoteAsset}
        />
      )}
      <View style={tw`flex-row mt-2`}>
        <PurchaseButton
          callback={chainOperation}
          variant={values.operationType === 'Buy' ? PurchaseType.BUY : PurchaseType.SELL}>
          <Typography size="sm" style={['font-medium']}>
            {values.operationType} {baseAsset}
          </Typography>
        </PurchaseButton>
      </View>
    </View>
  );
};

const getMaxLeverageFromMarket = (market) => {
  return new BigNumberInBase(
    new BigNumberInBase(1)
      .dividedBy(
        (market as UiPerpetualMarketWithToken | UiExpiryFuturesMarketWithToken).initialMarginRatio
      )
      .dp(0)
  );
};

const FuturesLeveragePicker = ({ onChange, maxLeverage, currentValue }) => {
  return (
    <Dropdown
      value={currentValue}
      onChangeValue={(value) => {
        onChange(value);
      }}
      options={[
        { key: '1', title: '1x' },
        { key: '2', title: '2x' },
        { key: '3', title: '3x' },
        { key: '5', title: '5x' },
        maxLeverage.isGreaterThanOrEqualTo(10) ? { key: '10', title: '10x' } : undefined,
        maxLeverage.isGreaterThanOrEqualTo(20) ? { key: '20', title: '20x' } : undefined,
      ].filter((x) => x)}
      style={tw`w-16`}
    />
  );
};

type CurrencyInputProps = {
  balance?;
  inputLabel?: string;
  currencyLabel?;
  withControlers?;
  value;
  onChange;
  precision;
  withRange?;
  displayBalance?;
} & InputProps;

type InputProps = {
  placeholder?;
  disabled;
  textAlign?: 'center' | 'left' | 'right';
};

const CurrencyInput = ({
  placeholder,
  value,
  disabled,
  setValue,
  textAlign = 'center',
}: InputProps & { value; setValue }) => {
  const handleChange = (text) => {
    setValue(text);
  };

  return (
    <TextInput
      style={tw.style(
        `flex-1 text-${disabled ? 'tertiary' : 'white'} h-full py-0 text-${textAlign}`
      )}
      keyboardType="decimal-pad"
      selectionColor={tw.color('black')}
      placeholderTextColor={tw.color('tertiary')}
      placeholder={placeholder}
      editable={!disabled}
      selectTextOnFocus={!disabled}
      value={value}
      onChangeText={handleChange}
    />
  );
};

export const CurrencyInputWithControllers = ({
  withRange,
  withControlers,
  balance,
  precision,
  displayBalance = true,
  placeholder,
  inputLabel,
  currencyLabel,
  disabled,

  value,
  onChange,
}: CurrencyInputProps) => {
  // TODO parse number in properly way
  const decreaseValue = () => {
    if (value <= 0) {
      return 0;
    }

    const newValue = parseFloat(value) - Math.pow(10, precision);
    onChange(parseFloatToString(newValue, precision));
  };

  const increaseValue = () => {
    if (!value) {
      const newValue = parseFloat('0') + Math.pow(10, precision);
      onChange(parseFloatToString(newValue, precision));
      return;
    }

    const newValue = parseFloat(value) + Math.pow(10, precision);
    onChange(parseFloatToString(newValue, precision));
  };

  const setPercentageValue = (percentage) => {
    onChange(parseFloatToString(balance * (percentage / 100), precision));
  };

  return (
    <View style={tw`mb-4`}>
      <View style={tw`flex-row justify-between mb-1`}>
        <Typography size="xs" style="text-tertiary">
          {inputLabel}
        </Typography>
        {balance && displayBalance && (
          <View style={tw`flex-row justify-between mb-1`}>
            <Typography size="xs" style="text-tertiary">
              Max.{' '}
            </Typography>
            <Typography size="xs" style="text-white">
              {balance}
            </Typography>
          </View>
        )}
      </View>
      <View style={tw`flex-row p-2 justify-between rounded-md border-2 border-shade1 max-h-11`}>
        {withControlers && !disabled && (
          <InputController type={ControllerType.DECREASE} handlePress={decreaseValue} />
        )}
        <CurrencyInput
          value={value}
          setValue={(value) => onChange(value)}
          placeholder={placeholder}
          disabled={disabled}
          textAlign={!withControlers && currencyLabel ? 'left' : 'center'}
        />
        {withControlers && !disabled && (
          <InputController type={ControllerType.INCREASE} handlePress={increaseValue} />
        )}
        {!withControlers && currencyLabel && (
          <Typography size="sm" style={tw`mt-.5 text-tertiary`}>
            {currencyLabel}
          </Typography>
        )}
      </View>
      {withRange && <RangeSelector onClick={setPercentageValue} />}
    </View>
  );
};

const parseFloatToString = (newValue, precision) => {
  return newValue.toFixed(Math.abs(precision)).toString();
};

enum ControllerType {
  INCREASE,
  DECREASE,
}

const InputController = ({ type, handlePress }) => {
  return (
    <Button
      style={tw`bg-shade1 p-2 rounded-[4px]`}
      onPress={handlePress}
      icon={{
        svg: type === ControllerType.DECREASE ? MinusSVG : PlusSVG,
        color: tw.color('shade1'),
        stroke: tw.color('tertiary'),
        strokeWidth: 2,
        size: 12,
      }}
    />
  );
};

const RangeSelector = ({ onClick }) => {
  return (
    <View style={tw`flex-row gap-1.5 mt-3`}>
      {[25, 50, 75, 100].map((percent, index) => (
        <Button
          key={index}
          onPress={() => onClick(percent)}
          style={tw.style('bg-shade1 flex-1 rounded-md py-1')}>
          <Typography style="text-tertiary" size="xxs">
            {percent}%
          </Typography>
        </Button>
      ))}
    </View>
  );
};
