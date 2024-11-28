import { db } from '@/modules/database/schema';
import { getFirstMonth, getLastMonth } from './month';

import { LineChartMultipleData } from '@/types/charts';
import { DbMonth, MonthPair, MonthRange } from '@/types/database';

interface CountResult {
  count: number;
}

/** Exact same query like getNewOldCompaniesForTwoMonths, just counts. */
const getNewOldCompaniesCountForTwoMonths = (monthPair: MonthPair): LineChartMultipleData => {
  const { forMonth, comparedToMonth } = monthPair;

  const firstTimeCompaniesCount =
    db
      .prepare<[string, string], CountResult>(
        `SELECT COUNT(*) as count 
         FROM company AS c1 
         WHERE c1.monthName = ? 
           AND c1.name NOT IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName < ?)`
      )
      .get(forMonth, forMonth)?.count ?? 0;

  const newCompaniesCount =
    db
      .prepare<[string, string, string], CountResult>(
        `SELECT COUNT(*) as count 
         FROM company AS c1 
         WHERE c1.monthName = ? 
           AND c1.name NOT IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName = ?) 
           AND c1.name IN (SELECT c3.name FROM company AS c3 WHERE c3.monthName < ?)`
      )
      .get(forMonth, comparedToMonth, forMonth)?.count ?? 0;

  const oldCompaniesCount =
    db
      .prepare<[string, string], CountResult>(
        `SELECT COUNT(*) as count 
         FROM company AS c1 
         WHERE c1.monthName = ? 
           AND c1.name IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName = ?)`
      )
      .get(forMonth, comparedToMonth)?.count ?? 0;

  const allCompaniesCount =
    db
      .prepare<[string], CountResult>(
        `SELECT COUNT(*) as count 
         FROM company 
         WHERE monthName = ?`
      )
      .get(forMonth)?.count ?? 0;

  return {
    monthName: forMonth,
    firstTimeCompaniesCount,
    newCompaniesCount,
    oldCompaniesCount,
    allCompaniesCount,
  };
};

// bellow just for array

const getNewOldCompaniesCountForFromToSubsequentMonths = (
  monthRange: MonthRange
): LineChartMultipleData[] => {
  const { fromMonth, toMonth } = monthRange;

  const subsequentMonths = db
    .prepare<
      [string, string],
      Pick<DbMonth, 'name'>
    >(`SELECT name FROM month WHERE name <= ? AND name >= ? ORDER BY name DESC`)
    .all(fromMonth, toMonth);

  const comparisons = subsequentMonths.slice(0, -1).map((month, index) => {
    const subsequentMonthsPair = {
      forMonth: month.name,
      comparedToMonth: subsequentMonths[index + 1].name,
    };
    return getNewOldCompaniesCountForTwoMonths(subsequentMonthsPair);
  });

  return comparisons;
};

/** The only needed and exported function. */

export const getNewOldCompaniesCountForAllMonths = (): LineChartMultipleData[] => {
  const firstMonth = getFirstMonth();
  const lastMonth = getLastMonth();

  // go backwards
  const monthRange: MonthRange = {
    fromMonth: lastMonth!.name,
    toMonth: firstMonth!.name,
  };

  return getNewOldCompaniesCountForFromToSubsequentMonths(monthRange).reverse(); // must reverse array
};
