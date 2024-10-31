import { fetchHtml } from '@/modules/parser/scraper/fetch-html';
import { convertDateToDbMonthName } from '@/libs/datetime';
import { SCRAPER } from '@/constants/scraper';

import type { Months, Thread } from '@/types/parser';

// todo: Support pagination later.

/** Handle just first search page from pagination. 30 items, 10 months. */

export const getThreads = async (): Promise<Thread[]> => {
  const {
    threadsUrl,
    threadPostTitleSelector,
    threadDateSelectorTemplate,
    threadHrefPlaceholder,
    hasHiringRegex,
  } = SCRAPER.threads;

  const doc = await fetchHtml(threadsUrl);
  const threadsNodes = doc.querySelectorAll<HTMLAnchorElement>(threadPostTitleSelector);

  const threads = [];

  for (const threadNode of threadsNodes) {
    if (!(threadNode && threadNode.textContent && threadNode.href)) continue;

    const { textContent, href } = threadNode;

    // search word 'hiring' in the post title
    const isHiringPost = hasHiringRegex.test(textContent);

    // discard not hiring thread posts
    if (!isHiringPost) continue;

    // get monthName in format 'yyyy-MM' bellow

    // get links that point to thread id
    const threadLinkSelector = threadDateSelectorTemplate.replace(threadHrefPlaceholder, href);
    const threadsLinkNodes = doc.querySelectorAll<HTMLAnchorElement>(threadLinkSelector);

    // there are 3 links, 2nd has span parent with date
    const dateTitleAttribute = (threadsLinkNodes[1].parentNode as Element)?.getAttribute('title');
    if (!dateTitleAttribute) continue;

    const dateString = dateTitleAttribute.split(' ')[0];
    const dateObject = new Date(dateString);

    const monthName = convertDateToDbMonthName(dateObject);

    const thread = { month: monthName, link: href };
    threads.push(thread);
  }

  return threads;
};

export const getAllMonths = async (): Promise<string[]> => {
  const allThreads = await getThreads();
  const allMonths = allThreads.map((thread) => thread.month);

  return allMonths;
};
