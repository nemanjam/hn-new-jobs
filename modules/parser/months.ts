import { getAllMonths } from '@/modules/parser/algolia/threads';
import { getFirstMonth } from '@/modules/database/select/month';

/** Always update latest month. */

export const getNewMonthName = async (): Promise<string> => {
  const parsedMonths = await getAllMonths();
  if (!(parsedMonths.length > 0))
    throw new Error(`Invalid parsedMonths length: ${parsedMonths.length}`);

  // overwrite
  return parsedMonths[0];
};

export const getOldMonthName = async (): Promise<string> => {
  const firstMonth = getFirstMonth();

  const parsedMonths = await getAllMonths();
  if (!(parsedMonths.length > 0))
    throw new Error(`Invalid parsedMonths length: ${parsedMonths.length}`);

  let oldMonthName: string;

  // handle empty db
  if (!firstMonth) {
    // gets last thread on empty db
    oldMonthName = parsedMonths[0];
    return oldMonthName;
  }

  const index = parsedMonths.indexOf(firstMonth.name);
  // index not found or out of bounds
  if (!(index !== -1 && index < parsedMonths.length - 1))
    throw new Error(
      `IndexOf firstMonth.name: ${firstMonth.name} from database not found in parsedMonths.`
    );

  // get item after, do not overwrite
  oldMonthName = parsedMonths[index + 1];
  return oldMonthName;
};
