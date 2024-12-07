import Database from 'better-sqlite3';

import { Company, Month } from './types';

const db = new Database('database.db');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS months (
    name TEXT PRIMARY KEY
  );

  CREATE TABLE IF NOT EXISTS companies (
    name TEXT,
    link TEXT,
    month_name TEXT,
    FOREIGN KEY (month_name) REFERENCES months(name)
  );
`);

// Insert a new month with companies
export const parseNewMonth = async (month: Month): Promise<void> => {
  const insertMonth = db.prepare(`INSERT OR IGNORE INTO months (name) VALUES (?)`);
  const insertCompany = db.prepare(
    `INSERT INTO companies (name, link, month_name) VALUES (?, ?, ?)`
  );

  const transaction = db.transaction(() => {
    insertMonth.run(month.name);

    for (const company of month.companies) {
      insertCompany.run(company.name, company.link, month.name);
    }
  });

  transaction();
};

// Insert multiple months with sliding window (pagination)
export const parseFromToMonths = async (months: Month[]): Promise<void> => {
  const insertMonth = db.prepare(`INSERT OR IGNORE INTO months (name) VALUES (?)`);
  const insertCompany = db.prepare(
    `INSERT INTO companies (name, link, month_name) VALUES (?, ?, ?)`
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

// Compare two specific months by name
export const compareTwoMonths = async (
  month1: string,
  month2: string
): Promise<{ added: Company[]; removed: Company[] }> => {
  const month1Companies = db.prepare(`SELECT * FROM companies WHERE month_name = ?`).all(month1);
  const month2Companies = db.prepare(`SELECT * FROM companies WHERE month_name = ?`).all(month2);

  // Example comparison logic
  const added = month2Companies.filter((c) => !month1Companies.some((m1) => m1.name === c.name));
  const removed = month1Companies.filter((c) => !month2Companies.some((m2) => m2.name === c.name));

  return { added, removed };
};

// Compare the last two months
export const compareLastTwoSubsequentMonths = async (): Promise<{
  added: Company[];
  removed: Company[];
} | null> => {
  const months = db.prepare(`SELECT name FROM months ORDER BY name DESC LIMIT 2`).all();
  if (months.length < 2) return null;

  return compareTwoMonths(months[1].name, months[0].name);
};

// Compare from-to month pairs in sliding windows
export const compareFromToSubsequentMonthPairs = async (
  start: string,
  end: string
): Promise<Array<{ month1: string; month2: string; added: Company[]; removed: Company[] }>> => {
  const months = db
    .prepare(`SELECT name FROM months WHERE name BETWEEN ? AND ? ORDER BY name`)
    .all(start, end);

  const comparisons: Array<{
    month1: string;
    month2: string;
    added: Company[];
    removed: Company[];
  }> = [];
  for (let i = 0; i < months.length - 1; i++) {
    const result = await compareTwoMonths(months[i].name, months[i + 1].name);
    comparisons.push({ month1: months[i].name, month2: months[i + 1].name, ...result });
  }

  return comparisons;
};

// Get months in which companies from the last month appeared
export const getMonthsForLastMonthsCompanies = async (): Promise<{
  lastMonth: string;
  companies: Array<string[]>;
} | null> => {
  const lastMonth = db.prepare(`SELECT name FROM months ORDER BY name DESC LIMIT 1`).get();
  if (!lastMonth) return null;

  const companies = db
    .prepare(`SELECT DISTINCT name FROM companies WHERE month_name = ?`)
    .all(lastMonth.name);
  const months = companies.map((company) =>
    db.prepare(`SELECT DISTINCT month_name FROM companies WHERE name = ?`).all(company.name)
  );

  return { lastMonth: lastMonth.name, companies: months };
};
