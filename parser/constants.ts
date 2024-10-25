export const PARSER = {
  threads: {
    threadsUrl: 'https://news.ycombinator.com/submitted?id=whoishiring',
    threadsSelector: 'tr.athing span.titleline a',
    monthRegex: /.*(?:hiring).*?\((\w+)/,
  },
  thread: {
    postsSelector: '.athing.comtr:has([indent="0"]) .commtext:first-child',
  },
  companies: {
    postsSelector: '.athing.comtr:has([indent="0"])',
    titleChildSelector: '.commtext:first-child',
    linkChildSelector: 'span.age a',
    companyNameRegex: /^([^|]+)\|/,
    removeLinkOrBracesRegex: /^(.*?)\s*(?:\([^)]*\)|https?:\/\/\S+)/,
  },
};
