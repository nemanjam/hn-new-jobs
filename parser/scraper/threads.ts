import { SCRAPER } from '@/parser/scraper/constants';
import { getDocumentFromUrl } from '@/parser/scraper/fetch-html';

export interface Thread {
  month: string;
  link: string;
}

export interface MonthPair {
  month1: string;
  month2: string;
}

export interface Months {
  allMonths: string[];
  monthPairs: MonthPair[];
}

// todo: Support pagination later.

/** Handle just first search page from pagination. 30 items, 10 months. */

export const getThreads = async (): Promise<Thread[]> => {
  const { threadsUrl, threadPostSelector, monthWordRegex } = SCRAPER.threads;

  const doc = await getDocumentFromUrl(threadsUrl);
  const threadsNodes = doc.querySelectorAll(threadPostSelector);

  const threads = [];

  for (const threadNode of threadsNodes) {
    // todo: handle not found and fix types
    const { textContent, href } = threadNode;

    const match = textContent.match(monthWordRegex);
    const month = match ? match[1].trim() : null;
    if (!month) continue;

    const link = threadNode.href;

    const thread = { month, link };
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
