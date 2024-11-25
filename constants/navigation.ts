export const ROUTES = {
  home: '/',
  currentMonth: '/current-month/',
  searchCompany: '/search-company/',
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
    {
      title: 'Search company',
      href: ROUTES.searchCompany,
      external: false,
    },
  ],
  right: {
    github: 'https://github.com/nemanjam/hn-parser-node',
    author: 'https://github.com/nemanjam',
  },
} as const;
