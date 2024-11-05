import { parseCompaniesForThread } from '@/modules/parser/algolia/comments';
import { getThreads } from '@/modules/parser/algolia/threads';
import { saveMonth } from '@/modules/parser/database';
import { CONFIG } from '@/config/parser';
import { getNewMonthName, getOldMonthName } from './months';

import { DbCompanyInsert, DbMonthInsert } from '@/types/database';

const { oldMonthsCount } = CONFIG;

/** Thread === DbMonthInsert */

export const getThreadFromMonthName = async (monthName: string): Promise<DbMonthInsert> => {
  const threads = await getThreads();
  const thread = threads.find((thread) => thread.name === monthName);

  if (!thread) throw new Error(`Thread for ${monthName} not found.`);

  return thread;
};

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

export const parseOldMonth = async (): Promise<void> => {
  const oldMonthName = await getOldMonthName();

  if (oldMonthName) await parseMonth(oldMonthName);
};

export const parseNOldMonths = async (count = oldMonthsCount): Promise<void> => {
  for (let i = 0; i < count; i++) {
    await parseOldMonth();
  }
};
