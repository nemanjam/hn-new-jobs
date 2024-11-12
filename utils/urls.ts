import { WEBSITE } from '@/constants/website';

const { threadOrCommentBaseUrl } = WEBSITE;

export const getThreadOrCommentUrlFromId = (threadOrCommentId: string): string =>
  `${threadOrCommentBaseUrl}${threadOrCommentId}`;
