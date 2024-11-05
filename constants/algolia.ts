export const ALGOLIA = {
  threads: {
    threadsBaseUrl: 'https://hn.algolia.com/api/v1/search_by_date?tags=story,author_whoishiring',
    hasHiringRegex: /hiring/i,
    hitsPerPageMax: 1000,
  },
  thread: {},
  comments: {
    // https://hn.algolia.com/api/v1/search_by_date?tags=comment,story_42017580
    threadBaseUrl: 'https://hn.algolia.com/api/v1/search_by_date?tags=comment,story_',
    companyNameRegex: /^([^|]+)\|/,
    removeLinkOrBracesRegex: /^(.*?)\s*(?:\([^)]*\)|https?:\/\/\S+)/,
    hitsPerPageMax: 1000,
  },
  axios: {
    // axios instance
    timeout: 10 * 1000,
    // axios-rate-limit
    delayBetweenRequests: 2 * 1000,
  },
};
