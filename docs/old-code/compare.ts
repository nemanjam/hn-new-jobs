import { formatResult } from '@/modules/parser/format';
import { parseCompaniesForThread } from '@/modules/parser/scraper/posts';
import { getThreadUrlFromMonth } from '@/modules/parser/scraper/thread';

import type { DbCompany } from '@/types/database';
import type { FormattedResult, NewAndOldCompanies } from '@/types/parser';

export const compareCompanies = (company1: DbCompany, company2: DbCompany): boolean => {
  const isEqual = company1.name === company2.name;
  // console.log('isEqual: ', isEqual, `${company1.name} === ${company2.name}`);

  return isEqual;
};

// outdated, not needed
export const getNewAndOldCompanies = (
  companies1: DbCompany[],
  companies2: DbCompany[]
): NewAndOldCompanies => {
  const newCompanies = [];
  const oldCompanies = [];

  for (const company2 of companies2) {
    let isNew = true;
    for (const company1 of companies1) {
      const isEqual = compareCompanies(company1, company2);
      if (isEqual) {
        isNew = false;
        break;
      }
    }

    if (isNew) newCompanies.push(company2);
    else oldCompanies.push(company2);
  }

  const result = { newCompanies, oldCompanies };
  return result;
};

// parser, outdated
export const compareTwoMonths = async (
  month1: string,
  month2: string
): Promise<FormattedResult> => {
  const threadUrl1 = await getThreadUrlFromMonth(month1);
  const threadUrl2 = await getThreadUrlFromMonth(month2);

  const companies1 = await parseCompaniesForThread(threadUrl1);
  const companies2 = await parseCompaniesForThread(threadUrl2);

  const result = getNewAndOldCompanies(companies1, companies2);

  const input = { result, month1, month2 };
  const output = formatResult(input);

  return output;
};
