import { fetchApi } from '@/modules/parser/algolia/fetch-api';
import { convertDateToMonthName } from '@/libs/datetime';
import { getPostIdFromHref } from '@/utils/strings';
import { ALGOLIA } from '@/constants/algolia';

import type { Thread } from '@/types/parser';
import { APost, ASearch } from '@/types/algolia';

// todo: Support pagination later.

/** Handle just first search page from pagination. 30 items, 10 months. */

export const getThreads = async (): Promise<APost[]> => {
  const { threadsUrl, hasHiringRegex } = ALGOLIA.threads;

  const searchResponse = await fetchApi<ASearch>(threadsUrl);

  const threads = searchResponse.hits.map(post => {

    const {title, created_at} = post;
       // search word 'hiring' in the post title
       const isHiringPost = hasHiringRegex.test(title);
    if (!isHiringPost) return false;

    const dateObject = new Date(created_at);
    if (isNaN(dateObject.getTime())) return false;

    const monthName = convertDateToMonthName(dateObject);

  }).filter(...)


  return threads;
};

export const getAllMonths = async (): Promise<string[]> => {
  const allThreads = await getThreads();
  const allMonths = allThreads.map((thread) => thread.month);

  return allMonths;
};
