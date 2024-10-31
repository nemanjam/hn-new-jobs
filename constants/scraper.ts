export const SCRAPER = {
  threads: {
    threadsUrl: 'https://news.ycombinator.com/submitted?id=whoishiring',
    threadPostFirstTrSelector: 'tr.athing[id]', // cspell:disable-line
    threadIdPlaceholder: '__thread-id__',
    threadLinkSelectorTemplate: 'a[href="item?id=__thread-id__"]', // 'a[href="item?id=41709301"]'
    hasHiringRegex: /hiring/i,
  },
  thread: {
    threadBaseUrl: 'https://news.ycombinator.com/',
    // just post title
    postTitleSelector: '.athing.comtr:has([indent="0"]) .commtext:first-child', // cspell:disable-line
    maxNumberOfPages: 10,
  },
  companies: {
    // entire post, queried again for title and link
    postSelector: '.athing.comtr:has([indent="0"])', // cspell:disable-line
    titleChildSelector: '.commtext:first-child', // cspell:disable-line
    linkChildSelector: 'span.age a',
    companyNameRegex: /^([^|]+)\|/,
    removeLinkOrBracesRegex: /^(.*?)\s*(?:\([^)]*\)|https?:\/\/\S+)/,
  },
} as const;
