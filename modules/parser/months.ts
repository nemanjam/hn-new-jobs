import { compareCompanies, compareTwoMonths } from '@/modules/parser/compare';
import { saveAsJsonFile } from '@/modules/parser/format';
import { getCompaniesForThread } from '@/modules/parser/scraper/posts';
import { getThreadUrlFromMonth } from '@/modules/parser/scraper/thread';
import { getAllMonths } from '@/modules/parser/scraper/threads';
import { CONFIG } from '@/config/parser';

import type { Company } from '@/types/parser';

const { saveAsFile, fileNames } = CONFIG;

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

export const compareAllMonths = async (): Promise<void> => {
  const parsedMonths = await getAllMonths();
  const { allMonths, monthPairs } = parsedMonths;

  const allResults = await Promise.all(
    monthPairs.map(async (monthPair) => compareTwoMonths(monthPair.month1, monthPair.month2))
  );

  if (saveAsFile) {
    const output = { allMonths, allResults };
    saveAsJsonFile(output, fileNames.outputAllMonths);
  }

  console.log(allMonths);
  console.table(allResults);
};

interface CompanyMonths {
  monthsCount: number;
  ads: (Company & { month: string })[];
  months: string[];
}

export const getNumberOfMonthsForLastMonthsCompanies = async (): Promise<void> => {
  const parsedMonths = await getAllMonths();
  const { allMonths } = parsedMonths;

  const month1 = allMonths[0];
  const threadUrl1 = await getThreadUrlFromMonth(month1);
  const companies1 = await getCompaniesForThread(threadUrl1);

  const allCompanies = [];
  for (const company1 of companies1) {
    const company: CompanyMonths = {
      ...company1,
      months: [],
      monthsCount: 0,
      ads: [],
    };
    for (const month of allMonths) {
      const threadUrl2 = await getThreadUrlFromMonth(month);
      const companies2 = await getCompaniesForThread(threadUrl2);

      for (const company2 of companies2) {
        const isEqual = compareCompanies(company1, company2);
        if (isEqual) {
          company.months.push(month);
          const companyAd = { ...company2, month };
          company.ads.push(companyAd);
          company.monthsCount++;
          break;
        }
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
