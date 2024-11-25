export const WEBSITE = {
  // thread https://news.ycombinator.com/item?id=42017580
  // comment https://news.ycombinator.com/item?id=42048826
  threadOrCommentBaseUrl: 'https://news.ycombinator.com/item?id=',
  waitDebounceSearchInput: 300,
  companySearchParam: 'company',
  companySearchMinLength: 2, // >= 2
  companySearchDefaultValue: '',
} as const;
