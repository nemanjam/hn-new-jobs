import { getThreads } from '@/modules/parser/algolia/threads';

import { DbMonthInsert } from '@/types/database';

/** Thread === DbMonthInsert */

export const getThreadFromMonthName = async (monthName: string): Promise<DbMonthInsert> => {
  const threads = await getThreads();
  const thread = threads.find((thread) => thread.name === monthName);

  if (!thread) throw new Error(`Thread for ${monthName} not found.`);

  return thread;
};
