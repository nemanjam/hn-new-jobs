import { WEBSITE } from '@/constants/website';

const { threadOrCommentBaseUrl, queryParams, scrollPositionSessionStorageKey } = WEBSITE;
const { search } = queryParams;

export const getThreadOrCommentUrlFromId = (threadOrCommentId: string): string =>
  `${threadOrCommentBaseUrl}${threadOrCommentId}`;

export const isCompanySearchMinLength = (query: string): boolean =>
  query.length >= search.minLength;

export const trimSlashes = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const trimTrailingSlash = (path: string) => path.replace(/\/$/, '');

export const getScrollPositionKey = (pathWithoutSlug: string) =>
  `${scrollPositionSessionStorageKey}--${pathWithoutSlug}`;
