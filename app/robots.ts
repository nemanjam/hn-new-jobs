import { MetadataRoute } from 'next';

import { SERVER_CONFIG } from '@/config/server';

export const dynamic = 'force-static';

const { siteUrl } = SERVER_CONFIG;

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
  },
  sitemap: `${siteUrl}/sitemap.xml`,
  host: siteUrl,
});

export default robots;
