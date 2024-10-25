

export const PARSER = {
    threads: {
        threadsUrl: 'https://news.ycombinator.com/submitted?id=whoishiring',
        threadsSelector: 'tr.athing span.titleline a',
        monthRegex: /.*(?:hiring).*?\((\w+)/,
    }
} as const;