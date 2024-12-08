import { getMonthByName } from '@/modules/database/select/month';
import { VALIDATION } from '@/constants/validation';

const { monthNameRegex } = VALIDATION;

/** Used only in db to validate for delete. */
export const isValidMonthName = (monthName: string): boolean => monthNameRegex.test(monthName);

/** In pages, validate month slug. */
export const isValidMonthNameWithDb = (monthName: string): boolean =>
  isValidMonthName(monthName) && Boolean(getMonthByName(monthName));
