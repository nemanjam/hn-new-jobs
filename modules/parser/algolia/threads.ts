import { fetchApi } from '@/modules/parser/algolia/fetch-api';
import { convertDateToMonthName } from '@/libs/datetime';
import { getPostIdFromHref } from '@/utils/strings';
import { ALGOLIA } from '@/constants/algolia';

import { APost, ASearch } from '@/types/algolia';
import type { Thread } from '@/types/parser';

// todo: Support pagination later.

/** Handle just first search page from pagination. 20 items, 6 months. */

export const getThreads = async (): Promise<Thread[]> => {
  const { threadsUrl, hasHiringRegex } = ALGOLIA.threads;

  const searchResponse = await fetchApi<ASearch>(threadsUrl);

  const invalidFlag = 'invalid' as const;

  const threads = searchResponse.hits
    .map((post) => {
      const blankThread: Thread = {
        month: invalidFlag,
        threadId: invalidFlag,
      };

      const { title, created_at, story_id } = post;

      // 1. filter out non-hiring threads

      // search word 'hiring' in the post title
      const isHiringPost = hasHiringRegex.test(title);
      if (!isHiringPost) return blankThread;

      // 2. get monthName
      const dateObject = new Date(created_at);
      if (isNaN(dateObject.getTime())) return blankThread;

      const month = convertDateToMonthName(dateObject);

      // 3. get threadId for url
      const threadId = String(story_id);
      if (!threadId) return blankThread;

      const thread: Thread = { month, threadId };

      return thread;
    })
    .filter((thread) => thread.month !== invalidFlag && thread.threadId !== invalidFlag);

  return threads;
};

// this will return only the first page for now
export const getAllMonths = async (): Promise<string[]> => {
  const allThreads = await getThreads();
  const allMonths = allThreads.map((thread) => thread.month);

  return allMonths;
};
