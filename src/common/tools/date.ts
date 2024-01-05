import { format, parseISO } from 'date-fns';
export { isWithinInterval, parseISO } from 'date-fns';

export const getNowTimestamp = () => new Date().toISOString();

type FormatType = 'date' | 'dayOfWeek' | 'dateTime' | 'time' | 'verboseTime';

const formatToSchema: Record<FormatType, string> = {
  date: 'dd.LL.uuuu',
  dayOfWeek: 'EEE',
  dateTime: 'uuuu-LL-dd HH:mm',
  time: 'HH:mm',
  verboseTime: 'HH:mm:ss',
};

export const removeOffset = (date: string | Date) => {
  const dt = date instanceof Date ? date : parseISO(date);
  return new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
};

export const formatDate = (date: string | Date, formatType: FormatType, withOffset = true) => {
  const dt = date instanceof Date ? date : parseISO(date);
  const dtDateOnly = withOffset ? dt : removeOffset(dt);

  const formattedDate = format(dtDateOnly, formatToSchema[formatType]);
  return formattedDate;
};

export const getTimeZoneOffset = (timestamp: number) =>
  new Date(timestamp).getTimezoneOffset() / -60;
