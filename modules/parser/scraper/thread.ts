import { getDocumentFromUrl } from '@/modules/parser/scraper/fetch-html';
import { getThreads } from '@/modules/parser/scraper/threads';
import { SCRAPER } from '@/constants/scraper';

export const getThreadUrlFromMonth = async (month: string): Promise<string> => {
  const threads = await getThreads();

  const thread = threads.find((thread) => thread.month === month);
  const { link } = thread;

  return link;
};

// pagination
export const getThreadPagesUrlsForMonth = async (threadUrl: string): Promise<string[]> => {
  const { postTitleSelector } = SCRAPER.thread;

  const pagesUrls = [];

  for (let page = 1; page < 10; page++) {
    const pageUrl = `${threadUrl}&p=${page}`;
    try {
      const doc = await getDocumentFromUrl(pageUrl);
      // check that thread page has job ads comments
      const postTitleNodes = doc.querySelectorAll(postTitleSelector);
      if (!(postTitleNodes.length > 0)) break;

      pagesUrls.push(pageUrl);
    } catch (error) {}
  }

  return pagesUrls;
};
