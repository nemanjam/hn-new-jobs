import { JSDOM } from 'jsdom';

import { fetchHtml } from '@/modules/parser/scraper/fetch-html';
import { convertDateToDbMonthName } from '@/libs/datetime';
import { SCRAPER } from '@/constants/scraper';

import type { Thread } from '@/types/parser';

// todo: Support pagination later.

/** Handle just first search page from pagination. 30 items, 10 months. */

export const getThreads = async (): Promise<Thread[]> => {
  const {
    threadsUrl,
    threadPostFirstTrSelector,
    threadLinkSelectorTemplate,
    threadIdPlaceholder,
    hasHiringRegex,
  } = SCRAPER.threads;

  const htmlContent = await fetchHtml(threadsUrl);

  const doc: Document = new JSDOM(htmlContent).window.document;

  const threadFirstTrNodes = doc.querySelectorAll<HTMLTableRowElement>(threadPostFirstTrSelector);

  const threads = [];

  for (const threadFirstTrNode of threadFirstTrNodes) {
    // work with these 2 tr nodes bellow, not entire dom
    const threadSecondTrNode = threadFirstTrNode?.nextElementSibling;
    const threadId = threadFirstTrNode?.id;

    if (!(threadFirstTrNode && threadId && threadSecondTrNode)) continue;

    // 1. get href
    // first tr

    // can be reused for both trs
    const threadLinkSelector = threadLinkSelectorTemplate.replace(threadIdPlaceholder, threadId);

    // the only link in first tr is title
    const threadTitleNode = threadFirstTrNode.querySelector<HTMLAnchorElement>(threadLinkSelector);
    if (!(threadTitleNode && threadTitleNode.textContent && threadTitleNode.href)) continue;

    const { textContent, href } = threadTitleNode;

    // search word 'hiring' in the post title
    const isHiringPost = hasHiringRegex.test(textContent);

    // discard not hiring thread posts
    if (!isHiringPost) continue;

    // 2. get monthName in format 'yyyy-MM' bellow
    // from second tr

    const threadsLinkNodes =
      threadSecondTrNode.querySelectorAll<HTMLAnchorElement>(threadLinkSelector);
    if (!(threadsLinkNodes?.length > 1)) continue;

    // there are 2 links, 1st has span parent with date
    const dateTitleAttribute = (threadsLinkNodes[0].parentNode as Element)?.getAttribute('title');
    if (!dateTitleAttribute) continue;

    const dateString = dateTitleAttribute.split(' ')[0];
    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) continue;

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
