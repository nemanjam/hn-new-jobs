import { WEBSITE } from '@/constants/website';

const { threadOrCommentBaseUrl, companySearchMinLength } = WEBSITE;

export const getThreadOrCommentUrlFromId = (threadOrCommentId: string): string =>
  `${threadOrCommentBaseUrl}${threadOrCommentId}`;

export const isCompanySearchMinLength = (query: string): boolean =>
  query.length >= companySearchMinLength;
