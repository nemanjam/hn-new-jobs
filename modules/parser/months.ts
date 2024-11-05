import { getAllMonths } from '@/modules/parser/algolia/threads';
import { getFirstMonth, getLastMonth } from '@/modules/parser/database';

export const getNewMonthName = async (): Promise<string | undefined> => {
  const lastMonth = getLastMonth();

  const parsedMonths = await getAllMonths();
  if (!(parsedMonths.length > 0)) return;

  let newMonthName: string;

  // handle empty db
  if (!lastMonth) {
    newMonthName = parsedMonths[0];
    return newMonthName;
  }

  const index = parsedMonths.indexOf(lastMonth.name);
  // new month is defined and not last month
  // index !== -1 && index >= 1
  if (!(index > 0)) return;

  // get item before
  newMonthName = parsedMonths[index - 1];
  return newMonthName;
};

export const getOldMonthName = async (): Promise<string | undefined> => {
  const firstMonth = getFirstMonth();

  const parsedMonths = await getAllMonths();
  if (!(parsedMonths.length > 0)) return;

  let oldMonthName: string;

  // handle empty db
  if (!firstMonth) {
    oldMonthName = parsedMonths[0];
    return oldMonthName;
  }

  const index = parsedMonths.indexOf(firstMonth.name);
  // index not found or out of bounds
  if (!(index !== -1 && index < parsedMonths.length - 1)) return;

  // get item after
  oldMonthName = parsedMonths[index + 1];
  return oldMonthName;
};
