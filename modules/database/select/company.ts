import { getDb } from '@/modules/database/schema';
import { getMonthByName, getMonthPairByName } from '@/modules/database/select/month';
import { convertCompanyRowType, withCommentsQuery } from '@/modules/database/select/utils';
import { cacheDatabaseWrapper, getDynamicCacheKey } from '@/libs/keyv';
import { CACHE_KEYS_DATABASE } from '@/constants/cache';

import { CompanyWithCommentsAsStrings, MonthPair, NewOldCompanies } from '@/types/database';

const { getNewOldCompaniesForMonthCacheKey } = CACHE_KEYS_DATABASE;

/** Compare two specific months by name. */

export const getNewOldCompaniesForTwoMonths = (monthPair: MonthPair): NewOldCompanies => {
  const { forMonth, comparedToMonth } = monthPair;

  // include entire objects for links
  const forMonthObject = getMonthByName(forMonth);
  const comparedToMonthObject = getMonthByName(comparedToMonth);

  // todo: if month not found throw and handle

  // Only in forMonth, single comment
  const firstTimeCompanies = getDb()
    .prepare<[string, string], CompanyWithCommentsAsStrings>(
      withCommentsQuery(
        `SELECT c1.* 
        FROM company AS c1 
        WHERE c1.monthName = ? 
          AND c1.name NOT IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName < ?) -- < at that time
        GROUP BY c1.name`
      )
    )
    .all(forMonth, forMonth)
    .map(convertCompanyRowType);

  // Companies present in forMonth but not in comparedToMonth
  // and excludes first time companies
  const newCompanies = getDb()
    .prepare<[string, string, string], CompanyWithCommentsAsStrings>(
      withCommentsQuery(
        `SELECT c1.* 
        FROM company AS c1 
        WHERE c1.monthName = ?  -- include only from the current month
          AND c1.name NOT IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName = ?)  -- exclude that exist in prev month
          AND c1.name IN (SELECT c3.name FROM company AS c3 WHERE c3.name = c1.name AND c3.monthName < ?)  -- exclude first time companies, at that time <
        GROUP BY c1.name`
      )
    )
    .all(forMonth, comparedToMonth, forMonth)
    .map(convertCompanyRowType);

  // important if it excludes (NOT IN) or includes (IN) -> c3.name = c1.name AND
  // must make sense in graph

  // Companies present in both forMonth and comparedToMonth
  // IN and NOT IN only difference
  const oldCompanies = getDb()
    .prepare<[string, string], CompanyWithCommentsAsStrings>(
      withCommentsQuery(
        `SELECT c1.*
         FROM company AS c1
         WHERE c1.monthName = ? 
           AND c1.name IN (SELECT c2.name FROM company AS c2 WHERE c2.name = c1.name AND c2.monthName = ?) 
         GROUP BY c1.name`
      )
    )
    .all(forMonth, comparedToMonth)
    .map(convertCompanyRowType);

  // companies for the forMonth
  const allCompanies = getDb()
    .prepare<
      [string],
      CompanyWithCommentsAsStrings
    >(withCommentsQuery(`SELECT * FROM company WHERE monthName = ? GROUP BY name`))
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

/** Only this is used per month. */
export const getNewOldCompaniesForMonth = (monthName: string): NewOldCompanies => {
  const monthPair = getMonthPairByName(monthName);
  const newOldCompanies = getNewOldCompaniesForTwoMonths(monthPair);

  return newOldCompanies;
};

export const getNewOldCompaniesForMonthCached = (monthName: string) =>
  cacheDatabaseWrapper(
    getDynamicCacheKey(getNewOldCompaniesForMonthCacheKey, monthName),
    getNewOldCompaniesForMonth,
    monthName
  );
