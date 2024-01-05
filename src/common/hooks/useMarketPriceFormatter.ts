import { QMarketType } from '../constants/enum';

import {
  SpotMarket,
  getDerivativeMarketTensMultiplier,
  getSpotMarketTensMultiplier,
} from '@injectivelabs/sdk-ts';
import { BigNumberInWei, BigNumberInBase } from '@injectivelabs/utils';

import { useMarketMetadata } from './useExchange';

export default function useMarketPriceFormatter(marketId: string, marketType: QMarketType) {
  const { data: marketMetadata } = useMarketMetadata(marketId);

  if (marketMetadata === undefined) {
    return {
      priceTensMultiplier: 2,
      quantityTensMultiplier: 2,
      priceFormat(value) {
        return '';
      },
      quantityFormat(value) {
        return '';
      },
    };
  }

  if (marketType === QMarketType.SPOT) {
    const spotMarketMetadata = marketMetadata as SpotMarket;
    const multiplier = getSpotMarketTensMultiplier({
      minPriceTickSize: spotMarketMetadata.minPriceTickSize,
      minQuantityTickSize: spotMarketMetadata.minQuantityTickSize,
      baseDecimals: spotMarketMetadata.baseToken.decimals,
      quoteDecimals: spotMarketMetadata.quoteToken.decimals,
    });
    return {
      ...multiplier,
      priceFormat(value) {
        return new BigNumberInBase(value)
          .toWei(spotMarketMetadata.baseToken.decimals - marketMetadata.quoteToken.decimals)
          .toFixed(Math.abs(multiplier.priceTensMultiplier));
      },
      quantityFormat(value) {
        return new BigNumberInWei(value)
          .toBase(spotMarketMetadata.baseToken.decimals)
          .toFixed(Math.abs(multiplier.quantityTensMultiplier));
      },
    };
  }

  const multiplier = getDerivativeMarketTensMultiplier({
    minPriceTickSize: marketMetadata.minPriceTickSize,
    minQuantityTickSize: marketMetadata.minQuantityTickSize,
    quoteDecimals: marketMetadata.quoteToken.decimals,
  });
  return {
    ...multiplier,
    priceFormat(value) {
      return new BigNumberInWei(value)
        .toBase(marketMetadata.quoteToken.decimals)
        .toFixed(Math.abs(multiplier.priceTensMultiplier));
    },
    quantityFormat(value) {
      return new BigNumberInWei(value).toFixed(Math.abs(multiplier.quantityTensMultiplier));
    },
  };
}
