import { JSDOM } from 'jsdom';

import { fetchHtml } from '@/modules/parser/scraper/fetch-html';
import { getThreads } from '@/modules/parser/scraper/threads';
import { createHrefFromPostId } from '@/utils/strings';
import { SCRAPER } from '@/constants/scraper';

const { postTitleSelector, maxNumberOfPages, threadBaseUrl } = SCRAPER.thread;

/**
 * Returns absolute thread url without pagination.
 * Absolute url as soon as possible.
 *
 * @example https://news.ycombinator.com/item?id=41709301
 */

export const getThreadUrlFromMonth = async (month: string): Promise<string> => {
  const threads = await getThreads();
  const thread = threads.find((thread) => thread.month === month);

  const postId = thread?.threadId;
  if (!postId) throw new Error(`Thread postId for ${month} not found.`);

  const threadHref = createHrefFromPostId(postId);
  const threadUrl = `${threadBaseUrl}${threadHref}`;

  return threadUrl;
};

/**
 * Returns absolute paginated page urls.
 *
 * @param {string} threadUrl - Absolute thread url.
 * @returns {Promise<string[]>} - Returns absolute thread url with pagination query param.
 *
 * @example https://news.ycombinator.com/item?id=41709301&p=3
 */

export const getThreadPagesUrlsForMonth = async (threadUrl: string): Promise<string[]> => {
  const pagesUrls = [];

  for (let page = 1; page < maxNumberOfPages; page++) {
    // both &p=1 and nothing are fine for first page
    const pageQueryParam = `&p=${page}`;

    // https://news.ycombinator.com/item?id=41709301&p=3
    const pageUrl = `${threadUrl}${pageQueryParam}`;

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
