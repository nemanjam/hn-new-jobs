import { fetchHtmlDocumentFromUrl } from '@/modules/parser/scraper/fetch-html';
import { SCRAPER } from '@/constants/scraper';

import type { Months, Thread } from '@/types/parser';

// todo: Support pagination later.

/** Handle just first search page from pagination. 30 items, 10 months. */

export const getThreads = async (): Promise<Thread[]> => {
  const { threadsUrl, threadPostSelector, monthWordRegex } = SCRAPER.threads;

  const doc = await fetchHtmlDocumentFromUrl(threadsUrl);
  const threadsNodes =
    doc.querySelectorAll<HTMLAnchorElement>(threadPostSelector);

  const threads = [];

  for (const threadNode of threadsNodes) {
    if (!(threadNode && threadNode.textContent && threadNode.href)) continue;

    const { textContent, href } = threadNode;

    const match = textContent.match(monthWordRegex);
    const month = match ? match[1].trim() : null;
    if (!month) continue;

    const thread = { month, link: href };
    threads.push(thread);
  }

  return threads;
};

export const getAllMonths = async (): Promise<Months> => {
  const allThreads = await getThreads();

  const allMonths = allThreads.map((thread) => thread.month);
  const monthPairs = allMonths
    .slice(0, -1)
    .map((value, index) => ({ month2: value, month1: allMonths[index + 1] }));

  const result = { allMonths, monthPairs };
  return result;
};
