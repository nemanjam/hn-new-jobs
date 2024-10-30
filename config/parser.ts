import { join } from 'path';

export const CONFIG = {
  saveAsFile: true,
  whichMonths: 'last-two',
  fetchWaitSeconds: 5,
  cacheFilePath: join(__dirname, '..', 'data/cache/cache.json'),
  databaseFilePath: join(__dirname, '..', 'data/database/hn-parser-node-database.sqlite3'),
  // todo: remove after database
  resultFolder: join(__dirname, '..', 'data/result/'),
  cacheTtlHours: 24,
  fileNames: {
    outputAllMonths: 'output-all-months.json',
    outputLastTwoMoths: 'output-last-two-months.json',
    outputAllCompanies: 'output-all-companies.json',
  },
} as const;
