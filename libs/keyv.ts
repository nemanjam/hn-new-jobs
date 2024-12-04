import fs from 'fs';

import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

import { Singleton } from '@/utils/singleton';
import { SERVER_CONFIG } from '@/config/server';

const { cacheHttpFilePath, cacheDatabaseFilePath, cacheDatabaseDisabled } = SERVER_CONFIG;

// deletes cache for testing
try {
  // fs.unlinkSync(cacheHttpFilePath);
  // fs.unlinkSync(cacheDatabaseFilePath);
} catch (error) {}

class CacheDatabaseInstance {
  private static createCacheDatabase(): Keyv {
    // ttl: undefined - infinite duration
    return new Keyv({
      store: new KeyvFile({ filename: cacheDatabaseFilePath }),
    });
  }

  public static getCacheDatabase(): Keyv {
    return Singleton.getInstance<Keyv>('CacheDatabaseInstance', () =>
      CacheDatabaseInstance.createCacheDatabase()
    );
  }
}

export const getCacheDatabase = CacheDatabaseInstance.getCacheDatabase;
class CacheHttpInstance {
  private static createCacheHttp(): Keyv {
    return new Keyv({
      store: new KeyvFile({ filename: cacheHttpFilePath }),
    });
  }

  public static getCacheHttp(): Keyv {
    return Singleton.getInstance<Keyv>('CacheHttpInstance', () =>
      CacheHttpInstance.createCacheHttp()
    );
  }
}

export const getCacheHttp = CacheHttpInstance.getCacheHttp;

export const cacheDatabaseWrapper = async <T, A extends any[]>(
  key: string,
  func: (...args: A) => T,
  ...args: A
): Promise<T> => {
  if (!cacheDatabaseDisabled) {
    const cachedResult = await getCacheDatabase().get<T>(key);
    if (cachedResult) return cachedResult;
  }

  const dbResult = func(...args);
  await getCacheDatabase().set(key, dbResult);

  return dbResult;
};

export const getDynamicCacheKey = (key: string, param: string): string =>
  Boolean(param) ? `${key}--${param}` : key;
