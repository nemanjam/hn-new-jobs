export const SCRAPER = {
  threads: {
    threadsUrl: 'https://news.ycombinator.com/submitted?id=whoishiring',
    threadPostTitleSelector: 'tr.athing span.titleline a', // cspell:disable-line
    // new
    threadDateSelectorTemplate: 'a[href="__thread-href__"]', // 'a[href="item?id=41709301"]'
    threadHrefPlaceholder: '__thread-href__',
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
