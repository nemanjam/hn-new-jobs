import { getThreads } from '@/parser/threads';

export const getThreadUrlFromMonth = async (month: string): Promise<string> => {
  const threads = await getThreads();

  const thread = threads.find((thread) => thread.month === month);
  const { link } = thread;

  return link;
};
