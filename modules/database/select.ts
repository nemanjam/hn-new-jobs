import { db } from '@/modules/database/schema';

import {
  CompanyComments,
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

export const getFirstTimeCompaniesForMonth = (monthName: string): DbCompany[] => {
  const firstTimeCompanies = db
    .prepare<[string, string], DbCompany>(
      `SELECT c.*
         FROM company AS c
         WHERE c.monthName = ? 
           AND NOT EXISTS (
             SELECT 1 
             FROM company AS older
             WHERE older.name = c.name
               AND older.monthName < ?
         )`
    )
    .all(monthName, monthName);

  return firstTimeCompanies;
};

/** Compare two specific months by name. */

export const getNewOldCompaniesForTwoMonths = (monthPair: MonthPair): NewOldCompanies => {
  const { forMonth, comparedToMonth } = monthPair;

  // include entire objects for links
  const forMonthObject = getMonthByName(forMonth);
  const comparedToMonthObject = getMonthByName(comparedToMonth);

  // todo: if month not found throw and handle

  // Companies present in forMonth but not in comparedToMonth
  const newCompanies = db
    .prepare<[string, string], DbCompany>(
      `SELECT c2.*
         FROM company AS c2
         WHERE c2.monthName = ? 
           AND c2.name NOT IN (
             SELECT c1.name
             FROM company AS c1
             WHERE c1.monthName = ?
           )`
    )
    .all(forMonth, comparedToMonth);

  // Companies present in both forMonth and comparedToMonth
  const oldCompanies = db
    .prepare<[string, string], DbCompany>(
      `SELECT c1.*
         FROM company AS c1
         WHERE c1.monthName = ? 
           AND c1.name IN (
             SELECT c2.name
             FROM company AS c2
             WHERE c2.monthName = ?
           )`
    )
    .all(forMonth, comparedToMonth);

  // Total count of companies in forMonth
  const totalCompaniesCount =
    db
      .prepare<[string], number>(`SELECT COUNT(*) FROM company WHERE monthName = ?`)
      .pluck()
      .get(forMonth) ?? 0;

  const firstTimeCompanies = getFirstTimeCompaniesForMonth(forMonth);

  return {
    forMonth: forMonthObject!,
    comparedToMonth: comparedToMonthObject!,
    newCompanies,
    oldCompanies,
    firstTimeCompanies,
    totalCompaniesCount,
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

  // (`SELECT name FROM month WHERE name BETWEEN ? AND ? ORDER BY name DESC`)
  // .all(toMonth, fromMonth); // order of args is important, works

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

/** Get all months in which companies from the last month appeared */

export const getCommentsForLastMonthCompanies = (): CompanyComments[] => {
  // handle undefined
  const lastMonth = getLastMonth();
  if (!lastMonth) return [];

  // compare only with older or equal months
  const query = `
      WITH LastMonthCompanies AS (
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
        COUNT(c.commentId) as commentsCount
      FROM company c
      INNER JOIN LastMonthCompanies lmc ON c.name = lmc.name
      WHERE c.monthName <= lmc.monthName
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
        // count
        commentsCount: number;
      }
    >(query)
    .all(lastMonth.name);

  return result.map((row) => ({
    company: {
      name: row.name,
      commentId: row.commentId,
      monthName: row.monthName,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    },
    comments: JSON.parse(row.comments) as DbCompany[],
    commentsCount: row.commentsCount,
  }));
};
