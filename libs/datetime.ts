import { format } from 'date-fns';

export const dbMonthNameFormat = 'yyyy-MM' as const;

export const convertDateToDbMonthName = (date: Date): string => {
  // format to 'YYYY-MM'
  const monthName = format(date, dbMonthNameFormat);

  return monthName;
};
