export const SCRAPER = {
  threads: {
    threadsUrl: 'https://news.ycombinator.com/submitted?id=whoishiring',
    threadPostSelector: 'tr.athing span.titleline a',
    monthWordRegex: /.*(?:hiring).*?\((\w+)/,
  },
  thread: {
    // just post title
    postTitleSelector: '.athing.comtr:has([indent="0"]) .commtext:first-child',
  },
  companies: {
    // entire post, queried again for title and link
    postSelector: '.athing.comtr:has([indent="0"])',
    titleChildSelector: '.commtext:first-child',
    linkChildSelector: 'span.age a',
    companyNameRegex: /^([^|]+)\|/,
    removeLinkOrBracesRegex: /^(.*?)\s*(?:\([^)]*\)|https?:\/\/\S+)/,
  },
};
