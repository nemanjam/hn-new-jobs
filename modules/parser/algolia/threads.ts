import { fetchApi } from '@/modules/parser/algolia/fetch-api';
import { convertDateToMonthName } from '@/libs/datetime';
import { ALGOLIA } from '@/constants/algolia';

import { APost, ASearch } from '@/types/algolia';
import { DbMonthInsert } from '@/types/database';

const { threadsBaseUrl, hitsPerPageMax, hasHiringRegex } = ALGOLIA.threads;

/** Returns all threads. 455 threads, first thread 2011-03, no pagination.  postId === threadId */

export const getThreads = async (): Promise<DbMonthInsert[]> => {
  const threadsUrl = `${threadsBaseUrl}&hitsPerPage=${hitsPerPageMax}`;

  const searchResponse = await fetchApi<ASearch>(threadsUrl);

  const invalidFlag = 'invalid' as const;

  const threads: DbMonthInsert[] = searchResponse.hits
    .map((post: APost) => {
      const blankThread: DbMonthInsert = {
        name: invalidFlag,
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

      const monthName = convertDateToMonthName(dateObject);

      // 3. get threadId for url
      const threadId = String(story_id);
      if (!threadId) return blankThread;

      const thread: DbMonthInsert = { name: monthName, threadId };

      return thread;
    })
    .filter((thread) => thread.name !== invalidFlag && thread.threadId !== invalidFlag);

  return threads;
};
/** Just project strings. Reused in few places. */
export const getAllMonths = async (): Promise<string[]> =>
  getThreads().then((threads) => threads.map((thread) => thread.name));
