import { db } from '@/modules/database/schema';

import {
  CompanyWithComments,
  CompanyWithCommentsAsStrings,
  DbCompany,
  DbMonth,
  MonthPair,
  MonthRange,
  NewOldCompanies,
} from '@/types/database';

/**
 * @returns {DbMonth | undefined} - Returns entire DbMonth object.
 */

export const getMonthByName = (monthName: string): DbMonth | undefined => {
  const month = db.prepare<string, DbMonth>(`SELECT * FROM month WHERE name = ?`).get(monthName);

  return month;
};

/**
 * @returns {DbMonth | undefined} - Returns entire DbMonth object.
 */

export const getLastMonth = (): DbMonth | undefined => {
  const lastMonth = db.prepare<[], DbMonth>(`SELECT * FROM month ORDER BY name DESC LIMIT 1`).get();

  return lastMonth;
};

/**
 * @returns {DbMonth | undefined} - Returns entire DbMonth object.
 */

export const getFirstMonth = (): DbMonth | undefined => {
  // SELECT name FROM month projects just name, but still returns object { name }
  const firstMonth = db.prepare<[], DbMonth>(`SELECT * FROM month ORDER BY name ASC LIMIT 1`).get();

  return firstMonth;
};

export type SortBy = 'commentsCount' | 'updatedAt';

/** Compare two specific months by name. */

export const getNewOldCompaniesForTwoMonths = (
  monthPair: MonthPair,
  sortBy: SortBy = 'commentsCount'
): NewOldCompanies => {
  const { forMonth, comparedToMonth } = monthPair;

  // include entire objects for links
  const forMonthObject = getMonthByName(forMonth);
  const comparedToMonthObject = getMonthByName(comparedToMonth);

  // todo: if month not found throw and handle

  const withCommentsQuery = (innerQuery: string, sortBy: SortBy = 'commentsCount'): string =>
    `WITH SelectedCompanies AS (
        ${innerQuery}
      )
      SELECT 
        c.name,
        c.commentId,
        c.monthName,
        c.createdAt,
        c.updatedAt,
        json_group_array(
          json_object(
            'name', c.name,
            'monthName', c.monthName,
            'commentId', c.commentId,
            'createdAt', c.createdAt,
            'updatedAt', c.updatedAt
          ) ORDER BY c.monthName DESC
        ) AS comments,
        COUNT(c.commentId) AS commentsCount  -- must keep for sort
      FROM company c
      INNER JOIN SelectedCompanies sc ON c.name = sc.name
      GROUP BY c.name
      ORDER BY ${sortBy === 'updatedAt' ? 'c.updatedAt' : 'commentsCount'} DESC;
      `;

  const convertCompanyRowType = (row: CompanyWithCommentsAsStrings): CompanyWithComments => ({
    company: {
      name: row.name,
      commentId: row.commentId,
      monthName: row.monthName,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    },
    comments: JSON.parse(row.comments) as DbCompany[],
  });

  // Only in forMonth, single comment
  const firstTimeCompanies = db
    .prepare<[string, string], CompanyWithCommentsAsStrings>(
      withCommentsQuery(
        `SELECT c.* 
         FROM company AS c 
         WHERE c.monthName = ? 
         AND NOT EXISTS (
           SELECT 1 FROM company AS older
           WHERE older.name = c.name AND older.monthName < ?
         )`,
        sortBy
      )
    )
    .all(forMonth, forMonth)
    .map(convertCompanyRowType);

  // Companies present in forMonth but not in comparedToMonth
  const newCompanies = db
    .prepare<[string, string], CompanyWithCommentsAsStrings>(
      withCommentsQuery(
        `SELECT c1.*
         FROM company AS c1
         WHERE c1.monthName = ? 
           AND c1.name NOT IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName = ?)
         GROUP BY c1.name`,
        sortBy
      )
    )
    .all(forMonth, comparedToMonth)
    .map(convertCompanyRowType);

  // Companies present in both forMonth and comparedToMonth
  // IN and NOT IN only difference
  const oldCompanies = db
    .prepare<[string, string], CompanyWithCommentsAsStrings>(
      withCommentsQuery(
        `SELECT c1.*
         FROM company AS c1
         WHERE c1.monthName = ? 
           AND c1.name IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName = ?) 
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

/** Compare the last two months. */

export const getNewOldCompaniesForLastTwoMonths = (): NewOldCompanies => {
  const lastTwoMonths = db
    .prepare<[], Pick<DbMonth, 'name'>>(`SELECT name FROM month ORDER BY name DESC LIMIT 2`)
    .all();

  const monthsPair: MonthPair = {
    forMonth: lastTwoMonths[0].name,
    comparedToMonth: lastTwoMonths[1].name,
  };

  return getNewOldCompaniesForTwoMonths(monthsPair);
};

/** Compare range of subsequent month pairs. For pagination. */

export const getNewOldCompaniesForFromToSubsequentMonths = (
  monthRange: MonthRange
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
    return getNewOldCompaniesForTwoMonths(subsequentMonthsPair);
  });

  return comparisons;
};

export const getNewOldCompaniesForAllMonths = (): NewOldCompanies[] => {
  const firstMonth = getFirstMonth();
  const lastMonth = getLastMonth();

  // go backwards
  const monthRange: MonthRange = {
    fromMonth: lastMonth!.name,
    toMonth: firstMonth!.name,
  };

  return getNewOldCompaniesForFromToSubsequentMonths(monthRange);
};

/** Get all months in which companies from some month appeared. */

export const getCommentsForCompaniesByMonth = (monthName: string): CompanyWithComments[] => {
  // compare for all months
  const query = `
      WITH MonthCompanies AS (
        SELECT * FROM company WHERE monthName = ? GROUP BY name
      )
      SELECT 
        c.name,
        c.commentId,
        c.monthName,
        c.createdAt,
        c.updatedAt,
        json_group_array(
          json_object(
            'name', c.name,
            'monthName', c.monthName,
            'commentId', c.commentId,
            'createdAt', c.createdAt,
            'updatedAt', c.updatedAt
          )
          ORDER BY c.monthName DESC
        ) as comments,
        COUNT(c.commentId) as commentsCount -- must keep for sort
      FROM company c
      INNER JOIN MonthCompanies mc ON c.name = mc.name
      GROUP BY c.name
      ORDER BY commentsCount DESC
    `;

  const result = db
    .prepare<
      string,
      {
        // DbCompany
        name: string;
        commentId: string;
        monthName: string;
        createdAt: string;
        updatedAt: string;
        // comments
        comments: string;
      }
    >(query)
    .all(monthName);

  return result.map((row) => ({
    company: {
      name: row.name,
      commentId: row.commentId,
      monthName: row.monthName,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    },
    comments: JSON.parse(row.comments) as DbCompany[],
  }));
};

export const getCommentsForLastMonthCompanies = (): CompanyWithComments[] => {
  // handle undefined
  const lastMonth = getLastMonth();
  if (!lastMonth) return [];

  return getCommentsForCompaniesByMonth(lastMonth.name);
};
