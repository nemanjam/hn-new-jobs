export const ALGOLIA = {
  threads: {
    threadsBaseUrl: 'https://hn.algolia.com/api/v1/search_by_date?tags=story,author_whoishiring',
    hasHiringRegex: /hiring/i,
    hitsPerPageMax: 1000,
    /** included in db */
    oldestUsefulMonth: '2015-06',
  },
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
    /**
     * axios-rate-limit
     *
     * https://hn.algolia.com/api
     * We are limiting the number of API requests from a single IP to 10,000 per hour.
     * 166 per minute, 2.77 per second, each 0.36 seconds
     */
    delayBetweenRequests: 2 * 1000,
  },
} as const;
