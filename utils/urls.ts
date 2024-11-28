import { WEBSITE } from '@/constants/website';

const { threadOrCommentBaseUrl, queryParams } = WEBSITE;
const { search } = queryParams;

export const getThreadOrCommentUrlFromId = (threadOrCommentId: string): string =>
  `${threadOrCommentBaseUrl}${threadOrCommentId}`;

export const isCompanySearchMinLength = (query: string): boolean =>
  query.length >= search.minLength;
