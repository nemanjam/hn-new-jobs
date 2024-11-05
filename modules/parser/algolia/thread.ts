import { getThreads } from '@/modules/parser/algolia/threads';

export const getThreadIdFromMonth = async (month: string): Promise<string> => {
  const threads = await getThreads();
  const thread = threads.find((thread) => thread.month === month);

  const threadId = thread?.threadId;
  if (!threadId) throw new Error(`threadId for ${month} not found.`);

  return threadId;
};
