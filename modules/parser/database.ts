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

export const getFirstTimeCompaniesForTwoMonths = (monthsPair: MonthPair): DbCompany[] => {
  const { forMonth, comparedToMonth } = monthsPair;

  const firstTimeCompanies = db
    .prepare<[string, string], DbCompany>(
      `SELECT c.* FROM company AS c
     WHERE c.monthName = ? AND c.name NOT IN (
       SELECT name FROM company WHERE monthName = ?
     )`
    )
    .all(forMonth, comparedToMonth);

  return firstTimeCompanies;
};

/** Compare two specific months by name. */

export const getNewOldCompaniesForTwoMonths = (monthPair: MonthPair): NewOldCompanies => {
  const { forMonth, comparedToMonth } = monthPair;

  const month1Companies = db
    .prepare<string, DbCompany>(`SELECT * FROM company WHERE monthName = ?`)
    .all(forMonth);
  const month2Companies = db
    .prepare<string, DbCompany>(`SELECT * FROM company WHERE monthName = ?`)
    .all(comparedToMonth);

  const newCompanies = month2Companies.filter(
    (c1) => !month1Companies.some((c2) => compareCompanies(c1, c2))
  );
  const oldCompanies = month1Companies.filter(
    (c1) => !month2Companies.some((c2) => compareCompanies(c1, c2))
  );

  const firstTimeCompanies = getFirstTimeCompaniesForTwoMonths(monthPair);

  return { ...monthPair, newCompanies, oldCompanies, firstTimeCompanies };
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

  const lastMonthCompanies: DbCompany[] = db
    // .prepare<string, DbCompany>(`SELECT DISTINCT name FROM company WHERE monthName = ?`)
    .prepare<string, DbCompany>(`SELECT * FROM company WHERE monthName = ? GROUP BY name`)
    .all(lastMonth.name);

  const companiesMonths: CompanyComments[] = lastMonthCompanies.map((company) => {
    const { name: companyName } = company;

    const comments: DbCompany[] = db
      // .prepare<string, DbCompany>(`SELECT DISTINCT monthName FROM company WHERE name = ?`)
      .prepare<string, DbCompany>(`SELECT * FROM company WHERE name = ? GROUP BY monthName`)
      .all(companyName);

    return { companyName, comments };
  });

  return companiesMonths;
};

/*-------------------------------- utils ------------------------------*/

export const compareCompanies = (company1: DbCompany, company2: DbCompany): boolean => {
  const isEqual = company1.name === company2.name;

  return isEqual;
};
