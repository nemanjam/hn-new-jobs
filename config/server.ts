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
  // paths
  databaseFilePath: join(projectRootFolder, './data/database/', databaseFileName),
  cacheFilePath: join(projectRootFolder, './data/cache/', 'cache.json'),
  logFilePath: join(projectRootFolder, './data/logs/', 'app.html'),
  // cache
  cacheTtlHours: 1, // todo: set this
  // parser
  oldMonthsCount: 12, // one year
  // parser and logs
  appTimeZone: 'Europe/Belgrade',
  appDateTimeFormat: 'dd MMM yyyy HH:mm:ss', // 10 Nov 2024 15:45:30
} as const;

export const logConfig = () => logPrettyPrintObject(SERVER_CONFIG, 'SERVER_CONFIG');
