import fs from 'fs';

import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

import { axiosRateLimitInstance } from '@/libs/axios';
import { createNumberOfSecondsSincePreviousCall, getAppNow } from '@/libs/datetime';
import logger from '@/libs/winston';
import { SERVER_CONFIG } from '@/config/server';

const { cacheFilePath, cacheTtlHours } = SERVER_CONFIG;

// disables cache for testing
try {
  // fs.unlinkSync(cacheFilePath);
} catch (error) {}

const cache = new Keyv({
  store: new KeyvFile({ filename: cacheFilePath }),
});

const secondsAgo = createNumberOfSecondsSincePreviousCall();

export const fetchApi = async <T>(url: string): Promise<T> => {
  // no try catch, use interceptor

  // check cache
  const cachedContent = await cache.get<T>(url);
  if (cachedContent) {
    logger.info(`Cache hit, url: ${url}`);
    return cachedContent;
  }

  logger.info(`Cache miss, url: ${url}`);

  // fetch
  // query params must be in url for cache key
  const response = await axiosRateLimitInstance.get<T>(url);
  const apiResponse = response.data;

  logger.info(
    `axiosRateLimitInstance call, ${getAppNow()}, ${secondsAgo()} seconds after previous`
  );

  // cache
  await cache.set(url, apiResponse, cacheTtlHours * 60 * 60 * 1000); // pass as arg

  return apiResponse;
};
