import { parseCompaniesForThread } from '@/modules/parser/algolia/comments';
import { getThreadFromMonthName } from '@/modules/parser/algolia/thread';
import { saveMonth } from '@/modules/parser/database';
import { getNewMonthName, getOldMonthName } from './months';

import { DbCompanyInsert, DbMonthInsert } from '@/types/database';

/** Main parsing function for month database updates. */

export const parseMonth = async (monthName: string): Promise<void> => {
  const thread: DbMonthInsert = await getThreadFromMonthName(monthName);
  const companies: DbCompanyInsert[] = await parseCompaniesForThread(thread.threadId);

  saveMonth(thread, companies);

  console.log(
    `Parsed month: ${thread.name}, threadId: ${thread.threadId}, saved ${companies.length} companies.`
  );
};

export const parseNewMonth = async (): Promise<void> => {
  const newMonthName = await getNewMonthName();

  if (newMonthName) await parseMonth(newMonthName);
};

// todo: do for range
export const parseOldMonth = async (): Promise<void> => {
  const oldMonthName = await getOldMonthName();

  if (oldMonthName) await parseMonth(oldMonthName);
};
