import { db } from '@/modules/database/schema';

import { DbMonth, MonthPair } from '@/types/database';

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

export const getAllMonths = (): DbMonth[] => {
  const allMonths = db.prepare<[], DbMonth>(`SELECT * FROM month ORDER BY name DESC`).all();

  return allMonths;
};

export const getLastMonth = (): DbMonth => {
  const lastMonth = db.prepare<[], DbMonth>(`SELECT * FROM month ORDER BY name DESC LIMIT 1`).get();

  return lastMonth!;
};

export const getFirstMonth = (): DbMonth => {
  // SELECT name FROM month projects just name, but still returns object { name }
  const firstMonth = db.prepare<[], DbMonth>(`SELECT * FROM month ORDER BY name ASC LIMIT 1`).get();

  return firstMonth!;
};
