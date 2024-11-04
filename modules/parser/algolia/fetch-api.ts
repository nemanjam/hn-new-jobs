import fs from 'fs';

import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

import { axiosRateLimitInstance } from '@/libs/axios';
import { CONFIG } from '@/config/parser';

const { cacheFilePath, cacheTtlHours } = CONFIG;

// disables cache for testing
try {
  // fs.unlinkSync(cacheFilePath);
} catch (error) {}

const cache = new Keyv({
  store: new KeyvFile({ filename: cacheFilePath }),
});

export const fetchApi = async <T>(url: string): Promise<T> => {
  // no try catch, use interceptor

  // check cache
  const cachedContent = await cache.get<T>(url);
  if (cachedContent) {
    console.log(`Cache hit, url: ${url}`);
    return cachedContent;
  }

  console.log(`Cache miss, url: ${url}`);

  // fetch
  const response = await axiosRateLimitInstance.get<T>(url);
  const apiResponse = response.data;

  // cache
  await cache.set(url, apiResponse, cacheTtlHours * 60 * 60 * 1000);

  return apiResponse;
};
