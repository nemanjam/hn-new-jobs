import BetterSqlite3 from 'better-sqlite3';

import { PARSER_CONFIG } from '@/config/parser';

import {
  CompanyComments,
  DbCompany,
  DbCompanyInsert,
  DbMonth,
  DbMonthInsert,
  MonthPair,
  MonthRange,
  NewOldCompanies,
} from '@/types/database';
import type { Database, RunResult } from 'better-sqlite3';

const { databaseFilePath } = PARSER_CONFIG;

/*-------------------------------- schema ------------------------------*/

const db: Database = new BetterSqlite3(databaseFilePath);

// todo: must invalidate cache for updatedAt

db.exec(`
  CREATE TABLE IF NOT EXISTS month (
    name TEXT PRIMARY KEY, -- "YYYY-MM" format for uniqueness
    threadId TEXT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- auto-populated
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP -- auto-populated on creation
  );

  CREATE TABLE IF NOT EXISTS company (
    name TEXT,
    monthName TEXT,
    commentId TEXT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (name, monthName),
    FOREIGN KEY (monthName) REFERENCES month(name)
  );
`);

/*-------------------------------- inserts ------------------------------*/

/**
 * Insert a new month with companies. The only insert needed.
 * @returns {number} - Returns numberOfRowsAffected.
 */

export const saveMonth = (month: DbMonthInsert, companies: DbCompanyInsert[]): number => {
  const upsertMonth = db.prepare<[string, string], RunResult>(
    `INSERT INTO month (name, threadId)
     VALUES (?, ?)
     ON CONFLICT(name) DO UPDATE SET updatedAt = CURRENT_TIMESTAMP`
  );

  const upsertCompany = db.prepare<[string, string, string], RunResult>(
    `INSERT INTO company (name, commentId, monthName)
     VALUES (?, ?, ?)
     ON CONFLICT(name, monthName) DO UPDATE SET updatedAt = CURRENT_TIMESTAMP`
  );

  let numberOfRowsAffected = 0;

  const transaction = db.transaction(() => {
    // Run the upsert for month
    const monthResult = upsertMonth.run(month.name, month.threadId);
    numberOfRowsAffected += monthResult.changes;

    // Run the upsert for each company and count updated rows
    for (const company of companies) {
      const companyResult = upsertCompany.run(company.name, company.commentId, month.name);
      numberOfRowsAffected += companyResult.changes;
    }
  });

  transaction();

  return numberOfRowsAffected;
};

/*-------------------------------- selects ------------------------------*/

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

/** Compare range of subsequent month pairs. */

export const getNewOldCompaniesForFromToSubsequentMonths = (
  monthsPair: MonthRange
): NewOldCompanies[] => {
  const { fromMonth, toMonth } = monthsPair;

  const subsequentMonths = db
    .prepare<
      [string, string],
      Pick<DbMonth, 'name'>
    >(`SELECT name FROM month WHERE name BETWEEN ? AND ? ORDER BY name`)
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

/*-------------------------------- utils ------------------------------*/

export const compareCompanies = (company1: DbCompany, company2: DbCompany): boolean => {
  const isEqual = company1.name === company2.name;

  return isEqual;
};
