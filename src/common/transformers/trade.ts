import { DerivativeTrade, SpotOrderHistory, SpotTrade } from '@injectivelabs/sdk-ts';
import { BigNumberInBase } from '@injectivelabs/utils';

export const transformSpotTradeUI = (trade: SpotTrade, marketFormat: any) => {
  const price = marketFormat.priceFormat(trade.price);
  const quantity = marketFormat.quantityFormat(trade.quantity);

  const total = new BigNumberInBase(price)
    .times(new BigNumberInBase(quantity))
    .toFixed(Math.abs(marketFormat.priceTensMultiplier));

  const feeFormat = marketFormat.quantityFormat(trade.fee);
  const fee = Number(feeFormat) > 0.01 ? feeFormat : '< 0.01';

  return { ...trade, price, quantity, total, fee };
};

export const transformDerivativeTradeUI = (trade: DerivativeTrade, marketFormat: any) => {
  const price = marketFormat.priceFormat(trade.executionPrice);
  const quantity = marketFormat.quantityFormat(trade.executionQuantity);

  const total = new BigNumberInBase(price)
    .times(new BigNumberInBase(quantity))
    .toFixed(Math.abs(marketFormat.priceTensMultiplier));

  const feeFormat = marketFormat.priceFormat(trade.fee);
  const fee = Number(feeFormat) > 0.01 ? feeFormat : '< 0.01';

  return { ...trade, price, quantity, total, fee };
};

export const transformSpotOrderHistoryUI = (order: SpotOrderHistory, marketFormat: any) => {
  const price = marketFormat.priceFormat(order.price);
  const quantity = marketFormat.quantityFormat(order.quantity);

  const total = new BigNumberInBase(price)
    .times(new BigNumberInBase(quantity))
    .toFixed(Math.abs(marketFormat.priceTensMultiplier));
  return { ...order, price, quantity, total };
};
