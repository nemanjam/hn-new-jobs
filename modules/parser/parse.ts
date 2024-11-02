import { getFirstMonth, getLastMonth, saveMonth } from '@/modules/parser/database';
import { parseCompaniesForThread } from '@/modules/parser/scraper/posts';
import { getThreadUrlFromMonth } from '@/modules/parser/scraper/thread';
import { getAllMonths } from './scraper/threads';

import type { DbCompany } from '@/types/database';
import type { PMonth } from '@/types/parser';

export const compareCompanies = (company1: DbCompany, company2: DbCompany): boolean => {
  const isEqual = company1.name === company2.name;
  // console.log('isEqual: ', isEqual, `${company1.name} === ${company2.name}`);

  return isEqual;
};

/** Main parsing function for month database updates. */

export const parseMonth = async (monthName: string): Promise<void> => {
  const threadUrl = await getThreadUrlFromMonth(monthName);
  const companies = await parseCompaniesForThread(threadUrl);

  const pMonth: PMonth = { name: monthName, companies };

  console.log('pMonth', pMonth);

  saveMonth(pMonth);
};

/** First available new month not present in database. */

export const parseNewMonth = async (): Promise<void> => {
  const lastMonth = getLastMonth();

  const parsedMonths = await getAllMonths();
  if (!(parsedMonths.length > 0)) return;

  let newMonthName: string;

  if (lastMonth) {
    const index = parsedMonths.indexOf(lastMonth.name);
    // new month is defined and not found, exit
    if (!(index > 0)) return;

    // get item before
    newMonthName = parsedMonths[index - 1];
  } else {
    // handle empty db
    newMonthName = parsedMonths[0];
  }

  console.log('newMonthName', newMonthName);

  await parseMonth(newMonthName);
};

/** First available older month not present in database. Pagination. */

export const parseOldMonth = async (): Promise<void> => {
  const firstMonth = getFirstMonth();

  const parsedMonths = await getAllMonths(); // todo: this should be different, pagination
  if (!(parsedMonths.length > 0)) return;

  let oldMonthName: string;

  if (firstMonth) {
    const index = parsedMonths.indexOf(firstMonth.name);
    // index not found or out of bounds
    if (!(index > 0 && index < parsedMonths.length - 1)) return;

    // get item after
    oldMonthName = parsedMonths[index + 1];
  } else {
    // handle empty db
    oldMonthName = parsedMonths[0];
  }

  console.log('oldMonthName', oldMonthName);

  await parseMonth(oldMonthName);
};
