import { db } from '@/modules/database/schema';
import { convertCompanyRowType, withCommentsQuery } from '@/modules/database/utils';
import { isCompanySearchMinLength } from '@/utils/urls';

import {
  CompanyWithComments,
  CompanyWithCommentsAsStrings,
  DbMonth,
  MonthPair,
  MonthRange,
  NewOldCompanies,
  SortBy,
  Statistics,
} from '@/types/database';

export const getMonthByName = (monthName: string): DbMonth => {
  const month = db.prepare<string, DbMonth>(`SELECT * FROM month WHERE name = ?`).get(monthName);

  return month!;
};

export const getPreviousMonth = (monthName: string): DbMonth => {
  const currentMonth = getMonthByName(monthName);

  // get the first older month
  const previousMonth = db
    .prepare<string, DbMonth>(`SELECT * FROM month WHERE name < ? ORDER BY name DESC LIMIT 1`)
    .get(currentMonth.name)!;

  return previousMonth;
};

export const getMonthPairByName = (monthName: string): MonthPair => {
  const currentMonth = getMonthByName(monthName);
  const previousMonth = getPreviousMonth(monthName);

  const monthsPair: MonthPair = {
    forMonth: currentMonth.name,
    comparedToMonth: previousMonth.name,
  };

  return monthsPair;
};

export const getLastMonth = (): DbMonth | undefined => {
  const lastMonth = db.prepare<[], DbMonth>(`SELECT * FROM month ORDER BY name DESC LIMIT 1`).get();

  return lastMonth;
};

export const getFirstMonth = (): DbMonth | undefined => {
  // SELECT name FROM month projects just name, but still returns object { name }
  const firstMonth = db.prepare<[], DbMonth>(`SELECT * FROM month ORDER BY name ASC LIMIT 1`).get();

  return firstMonth;
};

export const getStatistics = (): Statistics | undefined => {
  const statistics = db
    .prepare<[], Statistics>(
      `SELECT
       (SELECT COUNT(DISTINCT name) FROM month) AS monthsCount,
       (SELECT COUNT(DISTINCT commentId) FROM company) AS commentsCount,
       (SELECT COUNT(DISTINCT name) FROM company) AS companiesCount`
    )
    .get();

  return statistics;
};

export const searchCompanyByName = (name: string): CompanyWithComments[] => {
  if (!isCompanySearchMinLength(name)) return [];

  const companies = db
    .prepare<
      [string],
      CompanyWithCommentsAsStrings
    >(withCommentsQuery(`SELECT c1.* FROM company AS c1 WHERE name LIKE ? GROUP BY c1.name`, 'commentsCount'))
    .all(`%${name}%`)
    .map(convertCompanyRowType);

  return companies;
};

/** Compare two specific months by name. */

export const getNewOldCompaniesForTwoMonths = (
  monthPair: MonthPair,
  sortBy: SortBy = 'createdAtOriginal'
): NewOldCompanies => {
  const { forMonth, comparedToMonth } = monthPair;

  // include entire objects for links
  const forMonthObject = getMonthByName(forMonth);
  const comparedToMonthObject = getMonthByName(comparedToMonth);

  // todo: if month not found throw and handle

  // Only in forMonth, single comment
  const firstTimeCompanies = db
    .prepare<[string, string], CompanyWithCommentsAsStrings>(
      withCommentsQuery(
        `SELECT c1.* 
        FROM company AS c1 
        WHERE c1.monthName = ? 
          AND c1.name NOT IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName < ?) -- < at that time
        GROUP BY c1.name`,
        sortBy
      )
    )
    .all(forMonth, forMonth)
    .map(convertCompanyRowType);

  // Companies present in forMonth but not in comparedToMonth
  // and excludes first time companies
  const newCompanies = db
    .prepare<[string, string, string], CompanyWithCommentsAsStrings>(
      withCommentsQuery(
        `SELECT c1.* 
        FROM company AS c1 
        WHERE c1.monthName = ?  -- include only from the current month
          AND c1.name NOT IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName = ?)  -- exclude that exist in prev month
          AND c1.name IN (SELECT c3.name FROM company AS c3 WHERE c3.name = c1.name AND c3.monthName < ?)  -- exclude first time companies, at that time <
        GROUP BY c1.name`,
        sortBy
      )
    )
    .all(forMonth, comparedToMonth, forMonth)
    .map(convertCompanyRowType);

  // important if it excludes (NOT IN) or includes (IN) -> c3.name = c1.name AND
  // must make sense in graph

  // Companies present in both forMonth and comparedToMonth
  // IN and NOT IN only difference
  const oldCompanies = db
    .prepare<[string, string], CompanyWithCommentsAsStrings>(
      withCommentsQuery(
        `SELECT c1.*
         FROM company AS c1
         WHERE c1.monthName = ? 
           AND c1.name IN (SELECT c2.name FROM company AS c2 WHERE c2.name = c1.name AND c2.monthName = ?) 
         GROUP BY c1.name`,
        sortBy
      )
    )
    .all(forMonth, comparedToMonth)
    .map(convertCompanyRowType);

  // companies for the forMonth
  const allCompanies = db
    .prepare<
      [string],
      CompanyWithCommentsAsStrings
    >(withCommentsQuery(`SELECT * FROM company WHERE monthName = ? GROUP BY name`, sortBy))
    .all(forMonth)
    .map(convertCompanyRowType);

  return {
    forMonth: forMonthObject!,
    comparedToMonth: comparedToMonthObject!,
    firstTimeCompanies,
    newCompanies,
    oldCompanies,
    allCompanies,
  };
};

export const getNewOldCompaniesForMonth = (monthName: string): NewOldCompanies => {
  const monthPair = getMonthPairByName(monthName);
  const newOldCompanies = getNewOldCompaniesForTwoMonths(monthPair);

  return newOldCompanies;
};

/** Compare the last two months. */

export const getNewOldCompaniesForLastTwoMonths = (sortBy?: SortBy): NewOldCompanies => {
  const lastTwoMonths = db
    .prepare<[], Pick<DbMonth, 'name'>>(`SELECT name FROM month ORDER BY name DESC LIMIT 2`)
    .all();

  const monthsPair: MonthPair = {
    forMonth: lastTwoMonths[0].name,
    comparedToMonth: lastTwoMonths[1].name,
  };

  return getNewOldCompaniesForTwoMonths(monthsPair, sortBy);
};

/** Compare range of subsequent month pairs. For pagination. */

export const getNewOldCompaniesForFromToSubsequentMonths = (
  monthRange: MonthRange,
  sortBy?: SortBy
): NewOldCompanies[] => {
  //
  // fromMonth 2024-11, toMonth 2023-06
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
    return getNewOldCompaniesForTwoMonths(subsequentMonthsPair, sortBy);
  });

  return comparisons;
};

// this will override sort
export const getNewOldCompaniesForAllMonths = (sortBy?: SortBy): NewOldCompanies[] => {
  const firstMonth = getFirstMonth();
  const lastMonth = getLastMonth();

  // go backwards
  const monthRange: MonthRange = {
    fromMonth: lastMonth!.name,
    toMonth: firstMonth!.name,
  };

  return getNewOldCompaniesForFromToSubsequentMonths(monthRange, sortBy);
};
