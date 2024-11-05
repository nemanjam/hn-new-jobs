import BetterSqlite3 from 'better-sqlite3';

import { compareCompanies } from '@/modules/parser/parse';
import { CONFIG } from '@/config/parser';

import { DbCompany, DbMonth } from '@/types/database';
import { CompanyMonths, MonthsPair, NOCompanies, PMonth } from '@/types/parser';
import type { Database, RunResult } from 'better-sqlite3';

const { databaseFilePath } = CONFIG;

/*-------------------------------- schema ------------------------------*/

const db: Database = new BetterSqlite3(databaseFilePath);

// todo: add support for years in DbMonth, probably date
// convert from parser
db.exec(`
  CREATE TABLE IF NOT EXISTS month (
    name TEXT PRIMARY KEY, -- "YYYY-MM" format for uniqueness
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP -- auto-populated
  );

  CREATE TABLE IF NOT EXISTS company (
    name TEXT,
    commentId TEXT,
    monthName TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (name, monthName),
    FOREIGN KEY (monthName) REFERENCES month(name)
  );
`);

/*-------------------------------- inserts ------------------------------*/

/** Insert a new month with companies. The only insert needed. */

export const saveMonth = (month: PMonth): void => {
  const insertMonth = db.prepare<[string], RunResult>(
    `INSERT OR REPLACE INTO month (name) VALUES (?)`
  );
  const insertCompany = db.prepare<[string, string, string], RunResult>(
    `INSERT OR REPLACE INTO company (name, commentId, monthName) VALUES (?, ?, ?)`
  );

  const transaction = db.transaction(() => {
    insertMonth.run(month.name);

    for (const company of month.companies) {
      insertCompany.run(company.name, company.commentId, month.name);
    }
  });

  transaction();
};

/*-------------------------------- selects ------------------------------*/

export const getLastMonth = (): DbMonth | undefined => {
  const lastMonth = db
    .prepare<[], DbMonth>(`SELECT name FROM month ORDER BY name DESC LIMIT 1`)
    .get();

  return lastMonth;
};

export const getFirstMonth = (): DbMonth | undefined => {
  const firstMonth = db
    .prepare<[], DbMonth>(`SELECT name FROM month ORDER BY name ASC LIMIT 1`)
    .get();

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
    .prepare<[], DbMonth>(`SELECT name FROM month ORDER BY name DESC LIMIT 2`)
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
      DbMonth
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

  const lastMonthCompanies = db
    .prepare<string, DbCompany>(`SELECT DISTINCT name FROM company WHERE monthName = ?`)
    .all(lastMonth!.name);

  const companiesMonths: CompanyMonths[] = lastMonthCompanies.map((company) => {
    const { name: companyName } = company;

    const allMonths: DbCompany[] = db
      .prepare<string, DbCompany>(`SELECT DISTINCT monthName FROM company WHERE name = ?`)
      .all(companyName);

    return { companyName, allMonths };
  });

  return companiesMonths;
};
