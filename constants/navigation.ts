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
      title: 'Month',
      href: ROUTES.currentMonth,
      external: false,
    },
    {
      title: 'Search',
      href: ROUTES.searchCompany,
      external: false,
    },
  ],
  right: {
    github: 'https://github.com/nemanjam/hn-new-jobs',
    author: 'https://github.com/nemanjam',
  },
} as const;
