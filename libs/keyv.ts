// import fs from 'fs';

import Keyv, { KeyvStoreAdapter } from 'keyv';
import KeyvFile from 'keyv-file';

import { Singleton } from '@/utils/singleton';
import { SERVER_CONFIG } from '@/config/server';

const { KeyvLruManagedTtl } = require('keyv-lru');

const {
  cacheHttpFilePath,
  cacheDatabaseFilePath,
  cacheDatabaseLruItems,
  cacheHttpLruItems,
  cacheDatabaseDisabled,
} = SERVER_CONFIG;

// deletes cache for testing
try {
  // fs.unlinkSync(cacheHttpFilePath);
  // fs.unlinkSync(cacheDatabaseFilePath);
} catch (error) {}

/*-------------------------------- database cache ------------------------------*/

class CacheDatabaseInstance {
  private static storeAdapter: KeyvStoreAdapter | null = null;

  private static createCacheDatabase(): Keyv {
    return new Keyv({ store: CacheDatabaseInstance.storeAdapter });
  }

  public static setAdapter(adapter: KeyvStoreAdapter): void {
    CacheDatabaseInstance.storeAdapter = adapter;
  }

  public static getCacheDatabase(): Keyv {
    return Singleton.getInstance<Keyv>('CacheDatabaseInstance', () =>
      CacheDatabaseInstance.createCacheDatabase()
    );
  }
}

// ttl: undefined - infinite duration
const _databaseFileAdapter = new KeyvFile({ filename: cacheDatabaseFilePath });

const databaseLruAdapter = new KeyvLruManagedTtl({ max: cacheDatabaseLruItems });
CacheDatabaseInstance.setAdapter(databaseLruAdapter);

export const getCacheDatabase = CacheDatabaseInstance.getCacheDatabase;

/*-------------------------------- http cache ------------------------------*/

class CacheHttpInstance {
  private static storeAdapter: KeyvStoreAdapter | null = null;

  private static createCacheHttp(): Keyv {
    return new Keyv({ store: CacheHttpInstance.storeAdapter });
  }

  public static setAdapter(adapter: KeyvStoreAdapter): void {
    CacheHttpInstance.storeAdapter = adapter;
  }

  public static getCacheHttp(): Keyv {
    return Singleton.getInstance<Keyv>('CacheHttpInstance', () =>
      CacheHttpInstance.createCacheHttp()
    );
  }
}

const _httpFileAdapter = new KeyvFile({ filename: cacheHttpFilePath });

const httpLruAdapter = new KeyvLruManagedTtl({ max: cacheHttpLruItems });
CacheHttpInstance.setAdapter(httpLruAdapter);

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
