import { cacheDatabaseWrapper, getCacheDatabase } from '@/libs/keyv';
import logger from '@/libs/winston';
import { CACHE_KEYS_DATABASE } from '@/constants/cache';
import { getAllMonths } from './month';

import { DbMonth } from '@/types/database';

const { getUpdatedAtCacheKey } = CACHE_KEYS_DATABASE;

export const getUpdatedAt = (): string[] => getAllMonths().map((month) => month.updatedAt);

export const getUpdatedAtCached = () => cacheDatabaseWrapper(getUpdatedAtCacheKey, getUpdatedAt);

export const findUpdatedMonth = (
  allMonths: DbMonth[],
  updatedAtArray: string[]
): DbMonth | undefined => {
  const updatedAtSet = new Set(updatedAtArray);

  const dbMonth = allMonths.find((month) => !updatedAtSet.has(month.updatedAt));
  if (dbMonth) return dbMonth;

  const allMonthsUpdatedAtSet = new Set(allMonths.map((month) => month.updatedAt));
  const missingUpdatedAt = updatedAtArray.find(
    (updatedAt) => !allMonthsUpdatedAtSet.has(updatedAt)
  );
  if (missingUpdatedAt) {
    return {
      name: 'missing-in-db',
      threadId: 'missing-in-db',
      createdAtOriginal: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date(missingUpdatedAt).toISOString(),
    };
  }

  return undefined;
};

export const getUpdatedMonth = async (): Promise<DbMonth | undefined> => {
  const allMonths = getAllMonths();
  const updatedAtArrayCached = await getUpdatedAtCached();

  const updatedMonth = findUpdatedMonth(allMonths, updatedAtArrayCached);

  return updatedMonth;
};

/** This must run on every request, to detect change. */

export const clearCacheIfDatabaseUpdated = async (): Promise<DbMonth | undefined> => {
  const updatedMonth = await getUpdatedMonth();

  if (updatedMonth) {
    logger.info('Database changed, clearing cache, updatedMonth:', updatedMonth);
    await getCacheDatabase().clear();

    // populate cache again
    await getUpdatedAtCached();
  }

  return updatedMonth;
};
