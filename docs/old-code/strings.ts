import { SCRAPER } from '@/constants/scraper';

const { postIdRegex, postHrefPrefix } = SCRAPER.posts;

export const getPostIdFromHref = (href: string): string | undefined => {
  const match = href.match(postIdRegex);
  const postId = match ? match[1] : undefined;

  return postId;
};

/** 42023777 -> item?id=42023777 */
export const createHrefFromPostId = (postId: string): string => `${postHrefPrefix}${postId}`;
