import fs from 'fs';

import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

import { SERVER_CONFIG } from '@/config/server';

const { cacheHttpFilePath, cacheDatabaseFilePath, cacheDatabaseDisabled } = SERVER_CONFIG;

// disables cache for testing
try {
  // fs.unlinkSync(cacheHttpFilePath);
  // fs.unlinkSync(cacheDatabaseFilePath);
} catch (error) {}

export const cacheHttp = new Keyv({
  store: new KeyvFile({ filename: cacheHttpFilePath }),
});

// ttl: undefined - infinite duration
export const cacheDatabase = new Keyv({
  store: new KeyvFile({ filename: cacheDatabaseFilePath }),
});

export const cacheDatabaseWrapper = async <T, A extends any[]>(
  key: string,
  func: (...args: A) => T,
  ...args: A
): Promise<T> => {
  if (!cacheDatabaseDisabled) {
    const cachedResult = await cacheDatabase.get<T>(key);
    if (cachedResult) return cachedResult;
  }

  const dbResult = func(...args);
  await cacheDatabase.set(key, dbResult);

  return dbResult;
};

export const getDynamicCacheKey = (key: string, param: string): string =>
  Boolean(param) ? `${key}--${param}` : key;
