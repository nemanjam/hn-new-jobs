export const ROUTES = {
  home: '/',
  month: '/month/',
  search: '/search/',
} as const;

export const NAVIGATION = {
  left: [
    {
      title: 'Home',
      href: ROUTES.home,
      external: false,
    },
    {
      title: 'Month',
      href: ROUTES.month,
      external: false,
    },
    {
      title: 'Search',
      href: ROUTES.search,
      external: false,
    },
  ],
  right: {
    github: 'https://github.com/nemanjam/hn-new-jobs',
    author: 'https://github.com/nemanjam',
  },
} as const;
