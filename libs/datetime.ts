import {
  differenceInSeconds,
  format,
  getDate,
  isSaturday,
  isWeekend,
  parse,
  subMonths,
} from 'date-fns';
import { format as formatTz, toZonedTime } from 'date-fns-tz';

import { PARSER_CONFIG } from '@/config/parser';

const { appTimeZone, appDateTimeFormat } = PARSER_CONFIG;

export const DATETIME = {
  monthNameFormat: 'yyyy-MM',
  sanFranciscoTimeZone: 'America/Los_Angeles',
} as const;

const { monthNameFormat, sanFranciscoTimeZone } = DATETIME;

/**
 * Format to 'YYYY-MM'.
 * @example 2024-11
 */
export const convertDateToMonthName = (date: Date): string => format(date, monthNameFormat);

/**
 * Converts a 'YYYY-MM' formatted string to a Date object.
 */
export const convertMonthNameToDate = (monthString: string): Date =>
  parse(monthString, monthNameFormat, new Date());

/**
 * Format to 'dd/MM/yyyy HH:mm:ss' to Belgrade time zone.
 * @example 05/11/2024 14:30:01
 */
export const humanFormat = (date: Date): string =>
  formatTz(date, appDateTimeFormat, { timeZone: appTimeZone });

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

export const createOldMonthName = (monthName: string, monthsAgo: number): string => {
  const date = parse(monthName, monthNameFormat, new Date());
  const previousDate = subMonths(date, monthsAgo);
  return format(previousDate, monthNameFormat);
};
