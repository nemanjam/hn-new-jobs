import { parseCompaniesForThread } from '@/modules/parser/algolia/comments';
import { getThreads } from '@/modules/parser/algolia/threads';
import { saveMonth } from '@/modules/parser/database';
import { getNewMonthName, getOldMonthName } from './months';

import { DbCompanyInsert, DbMonthInsert } from '@/types/database';
import { ParserResult } from '@/types/parser';

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
  }

  return parserResults;
};
