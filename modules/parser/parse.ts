import { parseCompaniesForThread } from '@/modules/parser/algolia/comments';
import { getThreadIdFromMonth } from '@/modules/parser/algolia/thread';
import { saveMonth } from '@/modules/parser/database';
import { getNewMonthName, getOldMonthName } from './months';

/** Main parsing function for month database updates. */

export const parseMonth = async (monthName: string): Promise<void> => {
  const threadId = await getThreadIdFromMonth(monthName);
  const companies = await parseCompaniesForThread(threadId);

  saveMonth(monthName, companies);
};

export const parseNewMonth = async (): Promise<void> => {
  const newMonthName = await getNewMonthName();
  console.log('newMonthName', newMonthName);

  if (newMonthName) await parseMonth(newMonthName);
};

// todo: do for range
export const parseOldMonth = async (): Promise<void> => {
  const oldMonthName = await getOldMonthName();
  console.log('oldMonthName', oldMonthName);

  if (oldMonthName) await parseMonth(oldMonthName);
};
