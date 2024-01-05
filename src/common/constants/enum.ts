export const QMarketType = {
  DERIVATIVE: 'derivative',
  SPOT: 'spot',
} as const;

export type QMarketType = (typeof QMarketType)[keyof typeof QMarketType];
