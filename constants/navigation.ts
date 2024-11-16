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
    twitter: 'https://twitter.com/shadcn',
    github: 'https://github.com/shadcn/ui',
    docs: 'https://ui.shadcn.com',
  },
} as const;
