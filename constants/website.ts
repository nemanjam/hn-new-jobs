export const WEBSITE = {
  // thread https://news.ycombinator.com/item?id=42017580
  // comment https://news.ycombinator.com/item?id=42048826
  threadOrCommentBaseUrl: 'https://news.ycombinator.com/item?id=',
  waitDebounceSearchInput: 300,
  queryParams: {
    search: {
      name: 'company',
      minLength: 2, // >= 2
      defaultValue: '',
    },
  },
} as const;
