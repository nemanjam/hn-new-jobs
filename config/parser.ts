import { join } from 'path';

import { logPrettyPrintConfig } from '@/utils/log';

// !important, build, dev
const projectRootFolder = process.cwd();

const isProd = process.env.NODE_ENV === 'production';

const dbSuffix = isProd ? 'prod' : 'dev';
const databaseFileName = `hn-parser-node-database-${dbSuffix}.sqlite3`;

export const PARSER_CONFIG = {
  databaseFilePath: join(projectRootFolder, './data/database/', databaseFileName),
  parserSecret: process.env.PARSER_SECRET,
  nodeEnv: process.env.NODE_ENV,
  cacheFilePath: join(projectRootFolder, './data/cache/', 'cache.json'),
  cacheTtlHours: 1,
  oldMonthsCount: 5,
  appTimeZone: 'Europe/Belgrade',
} as const;

export const logConfig = () => logPrettyPrintConfig(PARSER_CONFIG, 'PARSER_CONFIG');
