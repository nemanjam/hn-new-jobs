import { saveNewMonth } from '@/modules/parser/database';
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

/** Main parsing function for new month database updates. */

export const parseNewMonth = async (): Promise<void> => {
  const parsedMonths = await getAllMonths();
  const newMonthName = parsedMonths[0];

  const threadUrl = await getThreadUrlFromMonth(newMonthName);
  const companies = await parseCompaniesForThread(threadUrl);

  const pMonth: PMonth = { name: newMonthName, companies };

  saveNewMonth(pMonth);
};
