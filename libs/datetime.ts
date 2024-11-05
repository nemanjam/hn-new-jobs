import { differenceInSeconds, format } from 'date-fns';

export const DATETIME_FORMATS = {
  monthNameFormat: 'yyyy-MM',
  europeanFormat: 'dd/MM/yyyy HH:mm:ss',
} as const;

const { monthNameFormat, europeanFormat } = DATETIME_FORMATS;

/**
 * Format to 'YYYY-MM'.
 * @example 2024-11
 */
export const convertDateToMonthName = (date: Date): string => format(date, monthNameFormat);

/**
 * Format to 'dd/MM/yyyy HH:mm:ss'.
 * @example 05/11/2024 14:30:01
 */
export const humanFormat = (date: Date): string => format(date, europeanFormat);

export const createNumberOfSecondsSincePreviousCall = (): (() => number) => {
  let previousCallTime: Date | null = null;

  return (): number => {
    const currentTime = new Date();

    if (previousCallTime === null) {
      previousCallTime = currentTime;
      return 0;
    }

    const timeDifference = differenceInSeconds(currentTime, previousCallTime);
    previousCallTime = currentTime;

    return timeDifference;
  };
};
