import { MetadataRoute } from 'next';

import { trimTrailingSlash } from '@/utils/urls';
import { ROUTES } from '@/constants/navigation';
import { SERVER_CONFIG } from '@/config/server';

export const dynamic = 'force-static';

const { siteUrl } = SERVER_CONFIG;

const sitemap = (): MetadataRoute.Sitemap => {
  // todo: add routes for months

  // trim trailing '/' only
  const trimmedRoutes = Object.values(ROUTES).map(trimTrailingSlash);

  const routes = trimmedRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes];
};

export default sitemap;
