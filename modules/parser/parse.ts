import { parseCompaniesForThread } from '@/modules/parser/algolia/comments';
import { getThreads } from '@/modules/parser/algolia/threads';
import { getNewMonthName, getOldMonthName } from '@/modules/parser/months';
import { saveMonth } from '@/modules/database/insert';
import logger from '@/libs/winston';
import { ALGOLIA } from '@/constants/algolia';

import { DbCompanyInsert, DbMonthInsert } from '@/types/database';
import { ParserResult } from '@/types/parser';

const { threads } = ALGOLIA;
const { oldestUsefulMonth } = threads;

/** Thread === DbMonthInsert */

export const getThreadFromMonthName = async (monthName: string): Promise<DbMonthInsert> => {
  const threads = await getThreads();
  const thread = threads.find((thread) => thread.name === monthName);

  if (!thread) throw new Error(`Thread for ${monthName} not found.`);

  return thread;
};

/** Main parsing function for month database updates. */

export const parseMonth = async (monthName: string): Promise<ParserResult> => {
  const thread: DbMonthInsert = await getThreadFromMonthName(monthName);
  const companies: DbCompanyInsert[] = await parseCompaniesForThread(thread.threadId);

  // '2024-12' >= '2015-06'
  if (!(thread.name >= oldestUsefulMonth)) {
    logger.warn(`oldestUsefulMonth: ${oldestUsefulMonth} reached, thread.name: ${thread.name}.`);

    const parserResult: ParserResult = {
      numberOfRowsAffected: 0,
      month: thread.name,
      threadId: thread.threadId,
      isOldestUsefulMonth: true,
    };
    return parserResult;
  }

  const numberOfRowsAffected = saveMonth(thread, companies);

  const parserResult: ParserResult = {
    numberOfRowsAffected,
    month: thread.name,
    threadId: thread.threadId,
  };

  return parserResult;
};

export const parseNewMonth = async (): Promise<ParserResult> => {
  const newMonthName = await getNewMonthName();
  return await parseMonth(newMonthName);
};

export const parseOldMonth = async (): Promise<ParserResult> => {
  const oldMonthName = await getOldMonthName();
  return await parseMonth(oldMonthName);
};

export const parseNOldMonths = async (count: number): Promise<ParserResult[]> => {
  const parserResults: ParserResult[] = [];

  for (let i = 0; i < count; i++) {
    const parserResult = await parseOldMonth();
    parserResults.push(parserResult);

    if (parserResult.isOldestUsefulMonth) return parserResults;
  }

  return parserResults;
};
