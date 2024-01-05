import { TypographyProps, Typography } from '@app/components/atoms/Typography/Typography';

export interface PercentProps {
  percent: number;
  style?: TypographyProps['style'];
}

export const Percent = ({ percent, style }: PercentProps) => {
  const ifGreenPercent = Number(percent) >= 0;
  const textStyle = Array.isArray(style) ? style : [style];
  return (
    <Typography size="xs" style={[...textStyle, ifGreenPercent ? 'text-green' : 'text-danger']}>
      {ifGreenPercent ? '+' : ''}
      {Number(percent).toFixed(1)}%
    </Typography>
  );
};
