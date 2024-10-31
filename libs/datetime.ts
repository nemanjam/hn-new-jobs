import { format, parse } from 'date-fns';

export const dbMonthNameFormat = 'yyyy-MM' as const;

export const convertPMonthNameToDbMonthName = (pMonthName: string): string => {
  // use current year
  const currentYear = new Date().getFullYear();

  // get the month index (0-11)
  const monthIndex = parse(pMonthName, 'MMMM', new Date()).getMonth();

  // format to 'YYYY-MM'
  const dbMonthName = format(new Date(currentYear, monthIndex), dbMonthNameFormat);

  return dbMonthName;
};

export const convertDateToDbMonthName = (date: Date): string => {
  // format to 'YYYY-MM'
  const dbMonthName = format(date, dbMonthNameFormat);

  return dbMonthName;
};
