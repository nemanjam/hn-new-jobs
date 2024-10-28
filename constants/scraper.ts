export const SCRAPER = {
  threads: {
    threadsUrl: 'https://news.ycombinator.com/submitted?id=whoishiring',
    threadPostSelector: 'tr.athing span.titleline a', // cspell:disable-line
    monthWordRegex: /.*(?:hiring).*?\((\w+)/,
  },
  thread: {
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
