export const ROUTES = {
  home: '/',
  thisMonth: '/this-month/',
} as const;

export const NAVIGATION = {
  left: [
    {
      title: 'Home',
      href: ROUTES.home,
      external: false,
    },
    {
      title: 'This month',
      href: ROUTES.thisMonth,
      external: false,
    },
  ],
  right: {
    github: 'https://github.com/nemanjam/hn-parser-node',
  },
} as const;
