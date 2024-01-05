import { Typography, type TypographyProps } from '@components/atoms/Typography/Typography';
import { CURRENCY_STATUS_COLOR } from '@constants/crypto';
import usePrevious from '@hooks/usePrevious';

export interface PriceProps {
  style?: TypographyProps['style'];
  size?: TypographyProps['size'];
  price: string;
  currency?: string;
}

export const Price = ({ style, size, price, currency }: PriceProps) => {
  const prevPrice = Number(usePrevious(price));
  const status = prevPrice ? (Number(price) > prevPrice ? 'UP' : 'DOWN') : 'DEFAULT';
  const textStyle = Array.isArray(style) ? style : [style];
  return (
    <Typography
      size={size || 'sm'}
      style={[...textStyle, 'font-medium', CURRENCY_STATUS_COLOR[status]]}>
      {price} {currency}
    </Typography>
  );
};
