import { join } from 'path';

import { logPrettyPrintObject } from '@/utils/pretty-print';

// !important, needs to work with both yarn build (.next) and yarn dev (src)
const projectRootFolder = process.cwd();

const isProd = process.env.NODE_ENV === 'production';

const dbSuffix = isProd ? 'prod' : 'dev';
const databaseFileName = `hn-new-jobs-database-${dbSuffix}.sqlite3`;

export const SERVER_CONFIG = {
  // api
  apiSecret: process.env.API_SECRET,
  nodeEnv: process.env.NODE_ENV,
  cacheDatabaseDisabled: process.env.CACHE_DATABASE_DISABLED === 'true', // for debugging
  // for metadata and seo
  siteHostname: process.env.SITE_HOSTNAME,
  siteUrl: `https://${process.env.SITE_HOSTNAME}`,
  // plausible
  plausibleDomain: process.env.PLAUSIBLE_DOMAIN,
  plausibleServerUrl: process.env.PLAUSIBLE_SERVER_URL, // build time, Docker
  // paths
  databaseFilePath: join(projectRootFolder, './data/database/', databaseFileName),
  // unused
  cacheHttpFilePath: join(projectRootFolder, './data/cache/', 'cache-http.json'),
  cacheDatabaseFilePath: join(projectRootFolder, './data/cache/', 'cache-database.json'),
  logFilePath: join(projectRootFolder, './data/logs/', 'app.html'),
  // cache
  cacheDatabaseLruItems: 100,
  cacheHttpLruItems: 10,
  cacheHttpTtlMinutes: 5, // one old-many call
  // parser
  oldMonthsCount: 12, // one year
  // parser and logs
  appTimeZone: 'Europe/Belgrade',
  appDateTimeFormat: 'dd MMM yyyy HH:mm:ss', // 10 Nov 2024 15:45:30
  // database
  searchCompaniesLimit: 10,
} as const;

export const logConfig = () => logPrettyPrintObject(SERVER_CONFIG, 'SERVER_CONFIG');
