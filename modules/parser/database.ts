import BetterSqlite3 from 'better-sqlite3';

import { CONFIG } from '@/config/parser';

import {
  CompanyMonths,
  DbCompany,
  DbCompanyInsert,
  DbMonth,
  MonthsPair,
  NOCompanies,
} from '@/types/database';
import type { Database, RunResult } from 'better-sqlite3';

const { databaseFilePath } = CONFIG;

/*-------------------------------- schema ------------------------------*/

const db: Database = new BetterSqlite3(databaseFilePath);

// todo: add support for years in DbMonth, probably date
// convert from parser
db.exec(`
  CREATE TABLE IF NOT EXISTS month (
    name TEXT PRIMARY KEY, -- "YYYY-MM" format for uniqueness
    threadId TEXT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP -- auto-populated
  );

  CREATE TABLE IF NOT EXISTS company (
    name TEXT,
    monthName TEXT,
    commentId TEXT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (name, monthName),
    FOREIGN KEY (monthName) REFERENCES month(name)
  );
`);

/*-------------------------------- inserts ------------------------------*/

/** Insert a new month with companies. The only insert needed. */

export const saveMonth = (monthName: string, companies: DbCompanyInsert[]): void => {
  const insertMonth = db.prepare<[string], RunResult>(
    `INSERT OR REPLACE INTO month (name) VALUES (?)`
  );
  const insertCompany = db.prepare<[string, string, string], RunResult>(
    `INSERT OR REPLACE INTO company (name, commentId, monthName) VALUES (?, ?, ?)`
  );

  const transaction = db.transaction(() => {
    insertMonth.run(monthName);

    for (const company of companies) {
      insertCompany.run(company.name, company.commentId, monthName);
    }
  });

  transaction();
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

/** Compare two specific months by name. */

export const getNOCompaniesForTwoMonths = (monthsPair: MonthsPair): NOCompanies => {
  const { forMonth, comparedToMonth } = monthsPair;

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

  return { ...monthsPair, newCompanies, oldCompanies };
};

/** Compare the last two months. */

export const getNOCompaniesForLastTwoMonths = (): NOCompanies => {
  const lastTwoMonths = db
    .prepare<[], Pick<DbMonth, 'name'>>(`SELECT name FROM month ORDER BY name DESC LIMIT 2`)
    .all();

  const monthsPair: MonthsPair = {
    forMonth: lastTwoMonths[1].name,
    comparedToMonth: lastTwoMonths[0].name,
  };

  return getNOCompaniesForTwoMonths(monthsPair);
};

export const getFirstTimeCompaniesForLastMonth = (): DbCompany[] => {
  return [];
};

/** Compare from-to months for sliding window (pagination). */

export const getNOCompaniesForFromToSubsequentMonths = (monthsPair: MonthsPair): NOCompanies[] => {
  const { forMonth, comparedToMonth } = monthsPair;

  const subsequentMonths = db
    .prepare<
      [string, string],
      Pick<DbMonth, 'name'>
    >(`SELECT name FROM month WHERE name BETWEEN ? AND ? ORDER BY name`)
    .all(forMonth, comparedToMonth);

  const comparisons = subsequentMonths.slice(0, -1).map((month, index) => {
    const subsequentMonthsPair = {
      forMonth: month.name,
      comparedToMonth: subsequentMonths[index + 1].name,
    };
    return getNOCompaniesForTwoMonths(subsequentMonthsPair);
  });

  return comparisons;
};

/** Get all months in which companies from the last month appeared */

export const getMonthsForLastMonthsCompanies = (): CompanyMonths[] => {
  // handle undefined
  const lastMonth = getLastMonth();

  const lastMonthCompanies: DbCompany[] = db
    // .prepare<string, DbCompany>(`SELECT DISTINCT name FROM company WHERE monthName = ?`)
    .prepare<string, DbCompany>(`SELECT * FROM company WHERE monthName = ? GROUP BY name`)
    .all(lastMonth!.name);

  const companiesMonths: CompanyMonths[] = lastMonthCompanies.map((company) => {
    const { name: companyName } = company;

    const allMonths: DbCompany[] = db
      // .prepare<string, DbCompany>(`SELECT DISTINCT monthName FROM company WHERE name = ?`)
      .prepare<string, DbCompany>(`SELECT * FROM company WHERE name = ? GROUP BY monthName`)
      .all(companyName);

    return { companyName, allMonths };
  });

  return companiesMonths;
};

/*-------------------------------- utils ------------------------------*/

export const compareCompanies = (company1: DbCompany, company2: DbCompany): boolean => {
  const isEqual = company1.name === company2.name;

  return isEqual;
};
