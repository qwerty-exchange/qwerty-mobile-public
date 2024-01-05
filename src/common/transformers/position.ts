import { PerpetualMarket, Position, TradeDirection } from '@injectivelabs/sdk-ts';
import { ZERO_IN_BASE } from '@injectivelabs/sdk-ui-ts';
import { OrderSide } from '@injectivelabs/ts-types';
import { BigNumberInBase } from '@injectivelabs/utils';

import { calculateLiquidationPrice } from '@utils/derivatives';

export const transformPositionUI = (position: Position, market: PerpetualMarket) => {
  const marginMin = () => {
    return new BigNumberInBase(position.quantity)
      .times(position.markPrice)
      .minus(pnl())
      .times(market.maintenanceMarginRatio)
      .dividedBy(new BigNumberInBase(position.margin))
      .times(100)
      .toFixed(2);
  };

  const pnl = () => {
    return new BigNumberInBase(position.quantity)
      .times(
        new BigNumberInBase(position.markPrice).minus(new BigNumberInBase(position.entryPrice))
      )
      .times(position.direction === TradeDirection.Long ? 1 : -1);
  };

  const percentagePnl = () => {
    if (pnl().isNaN()) {
      return ZERO_IN_BASE;
    }

    return new BigNumberInBase(pnl().dividedBy(new BigNumberInBase(position.margin)).times(100));
  };

  const liquidationPrice =
    position &&
    calculateLiquidationPrice({
      price: position.entryPrice,
      orderType: position.direction === 'long' ? OrderSide.Buy : OrderSide.Sell,
      market: market as any,
      notionalWithLeverage: position.margin,
      quantity: position.quantity,
    });

  const total = new BigNumberInBase(position.quantity).times(
    new BigNumberInBase(position.markPrice)
  );

  const leverage = new BigNumberInBase(position.markPrice)
    .times(new BigNumberInBase(position.quantity))
    .dividedBy(new BigNumberInBase(position.margin).plus(pnl()));

  return {
    ...position,
    marginMin: marginMin(),
    pnl: pnl(),
    percentagePnl: percentagePnl(),
    total,
    leverage,
    liquidationPrice,
  };
};
