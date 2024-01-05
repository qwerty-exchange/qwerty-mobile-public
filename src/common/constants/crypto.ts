import { CurrencyStatus } from '../models/crypto';

import { ClassInput } from 'twrnc/dist/esm/types';

export const CURRENCY_STATUS_COLOR: Record<CurrencyStatus, ClassInput> = {
  UP: 'text-green',
  DEFAULT: 'text-white',
  DOWN: 'text-danger',
};
