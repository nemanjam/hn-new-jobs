import { getAllMonths } from '@/modules/parser/algolia/threads';
import { getFirstMonth } from '@/modules/parser/database';

/** Always update latest month. */

export const getNewMonthName = async (): Promise<string | undefined> => {
  const parsedMonths = await getAllMonths();
  if (!(parsedMonths.length > 0)) return;

  // overwrite
  const newMonthName = parsedMonths[0];
  return newMonthName;
};

export const getOldMonthName = async (): Promise<string | undefined> => {
  const firstMonth = getFirstMonth();

  const parsedMonths = await getAllMonths();
  if (!(parsedMonths.length > 0)) return;

  let oldMonthName: string;

  // handle empty db
  if (!firstMonth) {
    // gets last thread on empty db
    oldMonthName = parsedMonths[0];
    return oldMonthName;
  }

  const index = parsedMonths.indexOf(firstMonth.name);
  // index not found or out of bounds
  if (!(index !== -1 && index < parsedMonths.length - 1)) return;

  // get item after, do not overwrite
  oldMonthName = parsedMonths[index + 1];
  return oldMonthName;
};
