import { METADATA } from '@/constants/metadata';

const { github, author } = METADATA;

export const ROUTES = {
  home: '/',
  month: '/month/',
  search: '/search/',
} as const;

METADATA;

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
  right: { github, author },
} as const;
