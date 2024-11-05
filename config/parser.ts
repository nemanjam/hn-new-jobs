import { join } from 'path';

export const CONFIG = {
  saveAsFile: true,
  whichMonths: 'last-two',
  fetchWaitSeconds: 5,
  cacheFilePath: join(__dirname, '..', 'data/cache/cache.json'),
  databaseFilePath: join(__dirname, '..', 'data/database/hn-parser-node-database.sqlite3'),
  cacheTtlHours: 1,
  oldMonthsCount: 5,
} as const;
