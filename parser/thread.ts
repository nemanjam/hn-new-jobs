import { PARSER } from '@/parser/constants';
import { getDocumentFromUrl } from '@/parser/download';
import { getThreads } from '@/parser/threads';

export const getThreadUrlFromMonth = async (month: string): Promise<string> => {
  const threads = await getThreads();

  const thread = threads.find((thread) => thread.month === month);
  const { link } = thread;

  return link;
};

// pagination
export const getThreadPagesUrlsForMonth = async (
  threadUrl: string
): Promise<string[]> => {
  const { postsSelector } = PARSER.thread;

  const pagesUrls = [];

  for (let page = 1; page < 10; page++) {
    const pageUrl = `${threadUrl}&p=${page}`;
    try {
      const doc = await getDocumentFromUrl(pageUrl);
      const postsNodes = doc.querySelectorAll(postsSelector);
      if (!(postsNodes.length > 0)) break;

      pagesUrls.push(pageUrl);
    } catch (error) {}
  }

  return pagesUrls;
};
