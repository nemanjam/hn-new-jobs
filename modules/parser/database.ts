import BetterSqlite3 from 'better-sqlite3';

import { compareCompanies } from '@/modules/parser/compare';
import { CONFIG } from '@/config/parser';

import type { Database, RunResult } from 'better-sqlite3';
import { DbCompany, DbMonth } from '@/types/database';
import { CompanyMonths, MonthsPair, NewAndOldCompanies, PMonth } from '@/types/parser';

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
    name TEXT PRIMARY KEY,
    link TEXT,
    monthName TEXT,
    FOREIGN KEY (monthName) REFERENCES month(name)
  );
`);

/*-------------------------------- inserts ------------------------------*/

/** Insert a new month with companies. */

export const saveNewMonth = (month: PMonth): void => {
  const insertMonth = db.prepare<[string], RunResult>(
    `INSERT OR IGNORE INTO month (name) VALUES (?)`
  );
  const insertCompany = db.prepare<[string, string, string], RunResult>(
    `INSERT INTO company (name, link, monthName) VALUES (?, ?, ?)`
  );

  const transaction = db.transaction(() => {
    insertMonth.run(month.name);

    for (const company of month.companies) {
      insertCompany.run(company.name, company.link, month.name);
    }
  });

  transaction();
};

/** Insert multiple months with sliding window (pagination). */

export const saveFromToMonths = (months: PMonth[]): void => {
  const insertMonth = db.prepare<[string], RunResult>(
    `INSERT OR IGNORE INTO month (name) VALUES (?)`
  );
  const insertCompany = db.prepare<[string, string, string], RunResult>(
    `INSERT INTO company (name, link, monthName) VALUES (?, ?, ?)`
  );

  const transaction = db.transaction(() => {
    for (const month of months) {
      insertMonth.run(month.name);

      for (const company of month.companies) {
        insertCompany.run(company.name, company.link, month.name);
      }
    }
  });

  transaction();
};

/*-------------------------------- selects ------------------------------*/

/** Compare two specific months by name. */

export const getCompaniesForTwoMonths = (monthsPair: MonthsPair): NewAndOldCompanies => {
  const { forMonthName, comparedToMonthName } = monthsPair;

  const month1Companies = db
    .prepare<string, DbCompany>(`SELECT * FROM company WHERE monthName = ?`)
    .all(forMonthName);
  const month2Companies = db
    .prepare<string, DbCompany>(`SELECT * FROM company WHERE monthName = ?`)
    .all(comparedToMonthName);

  const newCompanies = month2Companies.filter(
    (c1) => !month1Companies.some((c2) => compareCompanies(c1, c2))
  );
  const oldCompanies = month1Companies.filter(
    (c1) => !month2Companies.some((c2) => compareCompanies(c1, c2))
  );

  return { ...monthsPair, newCompanies, oldCompanies };
};

/** Compare the last two months. */

export const getCompaniesForLastTwoSubsequentMonths = (): NewAndOldCompanies => {
  const lastTwoMonths = db
    .prepare<[], DbMonth>(`SELECT name FROM month ORDER BY name DESC LIMIT 2`)
    .all();

  const monthsPair: MonthsPair = {
    forMonthName: lastTwoMonths[1].name,
    comparedToMonthName: lastTwoMonths[0].name,
  };

  return getCompaniesForTwoMonths(monthsPair);
};

/** Compare from-to months for sliding window (pagination). */

export const getCompaniesForFromToSubsequentMonths = (
  monthsPair: MonthsPair
): NewAndOldCompanies[] => {
  const { forMonthName, comparedToMonthName } = monthsPair;

  const subsequentMonths = db
    .prepare<
      [string, string],
      DbMonth
    >(`SELECT name FROM month WHERE name BETWEEN ? AND ? ORDER BY name`)
    .all(forMonthName, comparedToMonthName);

  const comparisons = subsequentMonths.slice(0, -1).map((month, index) => {
    const subsequentMonthsPair = {
      forMonthName: month.name,
      comparedToMonthName: subsequentMonths[index + 1].name,
    };
    return getCompaniesForTwoMonths(subsequentMonthsPair);
  });

  return comparisons;
};

/** Get all months in which companies from the last month appeared */

export const getMonthsForLastMonthsCompanies = (): CompanyMonths[] => {
  const lastMonth = db
    .prepare<[], DbMonth>(`SELECT name FROM month ORDER BY name DESC LIMIT 1`)
    .get();

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
