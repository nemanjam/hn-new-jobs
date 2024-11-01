import { format } from 'date-fns';

export const monthNameFormat = 'yyyy-MM' as const;

/** format to 'YYYY-MM' */
export const convertDateToMonthName = (date: Date): string => format(date, monthNameFormat);
