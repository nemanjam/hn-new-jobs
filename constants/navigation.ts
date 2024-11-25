export const ROUTES = {
  home: '/',
  currentMonth: '/current-month/',
} as const;

export const NAVIGATION = {
  left: [
    {
      title: 'Home',
      href: ROUTES.home,
      external: false,
    },
    {
      title: 'Current month',
      href: ROUTES.currentMonth,
      external: false,
    },
  ],
  right: {
    github: 'https://github.com/nemanjam/hn-parser-node',
    author: 'https://github.com/nemanjam',
  },
} as const;
