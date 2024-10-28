import { compareCompanies, getNewAndOldCompanies } from '@/modules/parser/compare';
import { formatResult, saveAsJsonFile } from '@/modules/parser/format';
import { getCompaniesForThread } from '@/modules/parser/scraper/posts';
import { getThreadUrlFromMonth } from '@/modules/parser/scraper/thread';
import { getAllMonths } from '@/modules/parser/scraper/threads';
import { CONFIG } from '@/config/parser';

import type { FormattedResult } from '@/types/parser';

const { saveAsFile, fileNames } = CONFIG;

export const compareTwoMonths = async (
  month1: string,
  month2: string
): Promise<FormattedResult> => {
  const threadUrl1 = await getThreadUrlFromMonth(month1);
  const threadUrl2 = await getThreadUrlFromMonth(month2);

  const companies1 = await getCompaniesForThread(threadUrl1);
  const companies2 = await getCompaniesForThread(threadUrl2);

  const result = getNewAndOldCompanies(companies1, companies2);

  const input = { result, month1, month2 };
  const output = formatResult(input);

  return output;
};

export const compareAllMonths = async (): Promise<void> => {
  const parsedMonths = await getAllMonths();
  const { allMonths, monthPairs } = parsedMonths;

  const allResults = [];

  for (const monthPair of monthPairs) {
    const result = await compareTwoMonths(monthPair.month1, monthPair.month2);
    allResults.push(result);
  }

  if (saveAsFile) {
    const output = { allMonths, allResults };
    saveAsJsonFile(output, fileNames.outputAllMonths);
  }

  console.log(allMonths);
  console.table(allResults);
};

export const compareLastTwoMonths = async (): Promise<void> => {
  const parsedMonths = await getAllMonths();
  const { monthPairs } = parsedMonths;

  const monthPair = monthPairs[0];
  const result = await compareTwoMonths(monthPair.month1, monthPair.month2);

  const output = { result };

  if (saveAsFile) {
    saveAsJsonFile(output, fileNames.outputLastTwoMoths);
  }
  console.table(output);
};

export const getNumberOfMonthsForLastMonthsCompanies = async (): Promise<void> => {
  const parsedMonths = await getAllMonths();
  const { allMonths } = parsedMonths;

  const month1 = allMonths[0];
  const threadUrl1 = await getThreadUrlFromMonth(month1);
  const companies1 = await getCompaniesForThread(threadUrl1);

  const allCompanies = [];
  for (const company1 of companies1) {
    const company = { ...company1, months: [], monthsCount: 0, ads: [] };
    for (const month of allMonths) {
      const threadUrl2 = await getThreadUrlFromMonth(month);
      const companies2 = await getCompaniesForThread(threadUrl2);

      let isFound = false;
      let companyAd = null;
      for (const company2 of companies2) {
        const isEqual = compareCompanies(company1, company2);
        if (isEqual) {
          isFound = true;
          companyAd = { ...company2, month };
          break;
        }
      }
      if (isFound) {
        company.months.push(month);
        company.ads.push(companyAd);
        company.monthsCount++;
      }
    }
    allCompanies.push(company);
    console.log('company', company);
  }

  allCompanies.sort((a, b) => b.monthsCount - a.monthsCount);

  if (saveAsFile) {
    const output = { allCompanies };
    saveAsJsonFile(output, fileNames.outputAllCompanies);
  }

  console.table(allCompanies);
};
