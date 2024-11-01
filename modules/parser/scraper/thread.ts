import { JSDOM } from 'jsdom';

import { fetchHtml } from '@/modules/parser/scraper/fetch-html';
import { getThreads } from '@/modules/parser/scraper/threads';
import { SCRAPER } from '@/constants/scraper';

export const getThreadUrlFromMonth = async (month: string): Promise<string> => {
  const threads = await getThreads();

  const thread = threads.find((thread) => thread.month === month);
  // todo: fix this
  const { link } = thread!;

  return link;
};

// pagination
export const getThreadPagesUrlsForMonth = async (threadUrl: string): Promise<string[]> => {
  const { postTitleSelector, maxNumberOfPages, threadBaseUrl } = SCRAPER.thread;

  const pagesUrls = [];

  for (let page = 1; page < maxNumberOfPages; page++) {
    // both &p=1 and nothing are fine for first page
    const pageQueryParam = `&p=${page}`;

    // https://news.ycombinator.com/item?id=41709301&p=3
    const pageUrl = `${threadBaseUrl}${threadUrl}${pageQueryParam}`;

    // fetch page to check it exists
    const htmlContent = await fetchHtml(pageUrl);
    const doc: Document = new JSDOM(htmlContent).window.document;

    // check that thread page has job ads comments
    const postTitleNodes = doc.querySelectorAll<HTMLDivElement>(postTitleSelector);
    if (!(postTitleNodes.length > 0)) break;

    pagesUrls.push(pageUrl);
  }

  return pagesUrls;
};
