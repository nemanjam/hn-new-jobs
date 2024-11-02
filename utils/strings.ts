import { SCRAPER } from '@/constants/scraper';

const { postIdRegex } = SCRAPER.companies;

export const getPostIdFromHref = (href: string): string | undefined => {
  const match = href.match(postIdRegex);
  const postId = match ? match[1] : undefined;

  return postId;
};
