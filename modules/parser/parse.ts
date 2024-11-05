import { parseCompaniesForThread } from '@/modules/parser/algolia/comments';
import { getThreadIdFromMonth } from '@/modules/parser/algolia/thread';
import { getAllMonths } from '@/modules/parser/algolia/threads';
import { getFirstMonth, getLastMonth, saveMonth } from '@/modules/parser/database';

import type { DbCompany } from '@/types/database';
import type { PMonth } from '@/types/parser';

export const compareCompanies = (company1: DbCompany, company2: DbCompany): boolean => {
  const isEqual = company1.name === company2.name;
  // console.log('isEqual: ', isEqual, `${company1.name} === ${company2.name}`);

  return isEqual;
};

/** Main parsing function for month database updates. */

export const parseMonth = async (monthName: string): Promise<void> => {
  const threadId = await getThreadIdFromMonth(monthName);
  const companies = await parseCompaniesForThread(threadId);

  const pMonth: PMonth = { name: monthName, companies };

  console.log('pMonth', pMonth);

  saveMonth(pMonth);
};

/** First available new month not present in database. */

export const getNewMonthName = async (): Promise<string | undefined> => {
  const lastMonth = getLastMonth();

  const parsedMonths = await getAllMonths();
  if (!(parsedMonths.length > 0)) return;

  let newMonthName: string;

  // handle empty db
  if (!lastMonth) {
    newMonthName = parsedMonths[0];
    return newMonthName;
  }

  const index = parsedMonths.indexOf(lastMonth.name);
  // new month is defined and not found, exit
  if (!(index > 0)) return;

  // get item before
  newMonthName = parsedMonths[index - 1];
  return newMonthName;
};

export const parseNewMonth = async (): Promise<void> => {
  const newMonthName = await getNewMonthName();
  console.log('newMonthName', newMonthName);

  if (newMonthName) await parseMonth(newMonthName);
};

/** First available older month not present in database. Pagination. */

export const getOldMonthName = async (): Promise<string | undefined> => {
  const firstMonth = getFirstMonth();

  const parsedMonths = await getAllMonths();
  if (!(parsedMonths.length > 0)) return;

  let oldMonthName: string;

  // handle empty db
  if (!firstMonth) {
    oldMonthName = parsedMonths[0];
    return oldMonthName;
  }

  const index = parsedMonths.indexOf(firstMonth.name);
  // index not found or out of bounds
  if (!(index > 0 && index < parsedMonths.length - 1)) return;

  // get item after
  oldMonthName = parsedMonths[index + 1];
  return oldMonthName;
};

// todo: do for range
export const parseOldMonth = async (): Promise<void> => {
  const oldMonthName = await getOldMonthName();
  console.log('oldMonthName', oldMonthName);

  if (oldMonthName) await parseMonth(oldMonthName);
};
