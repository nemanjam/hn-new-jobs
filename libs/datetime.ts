import { differenceInSeconds, format, getDate, isSaturday, isWeekend } from 'date-fns';
import { format as formatTz, toZonedTime } from 'date-fns-tz';

import { PARSER_CONFIG } from '@/config/parser';

const { appTimeZone } = PARSER_CONFIG;

export const DATETIME = {
  monthNameFormat: 'yyyy-MM',
  europeanFormat: 'dd/MM/yyyy HH:mm:ss',
  belgradeTimeZone: 'Europe/Belgrade',
  sanFranciscoTimeZone: 'America/Los_Angeles',
} as const;

const { monthNameFormat, europeanFormat, sanFranciscoTimeZone } = DATETIME;

/**
 * Format to 'YYYY-MM'.
 * @example 2024-11
 */
export const convertDateToMonthName = (date: Date): string => format(date, monthNameFormat);

/**
 * Format to 'dd/MM/yyyy HH:mm:ss' to Belgrade time zone.
 * @example 05/11/2024 14:30:01
 */
export const humanFormat = (date: Date): string =>
  formatTz(date, europeanFormat, { timeZone: appTimeZone });

export const getAppTime = (dateTime: Date): Date => toZonedTime(dateTime, appTimeZone);

export const getAppNow = (): Date => getAppTime(new Date());

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

/**
 * Is 1st or 2nd and weekend in San Francisco timezone.
 * @returns true for weekend.
 */

export const isWeekendAndStartOfMonth = (dateTime: Date): boolean => {
  const zonedDate = toZonedTime(dateTime, sanFranciscoTimeZone);

  const dayOfMonth = getDate(zonedDate);
  const isFirstOrSecond = dayOfMonth === 1 || dayOfMonth === 2;

  const isWeekendDay = isWeekend(zonedDate);

  // is weekend but Friday was 1st
  const isSecondAndSaturday = dayOfMonth === 2 && isSaturday(zonedDate);

  const result = isFirstOrSecond && isWeekendDay && !isSecondAndSaturday;

  return result;
};
