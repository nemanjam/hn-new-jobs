import fs from 'fs';

import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

import { axiosRetryInstance } from '@/libs/axios';
import { CONFIG } from '@/config/parser';

const { cacheFilePath, cacheTtlHours } = CONFIG;

// disables cache for testing
try {
  fs.unlinkSync(cacheFilePath);
} catch (error) {}

const cache = new Keyv({
  store: new KeyvFile({ filename: cacheFilePath }),
});

export const fetchHtml = async (url: string): Promise<string> => {
  // no try catch, use interceptor

  // check cache
  const cachedContent = await cache.get<string>(url);
  if (cachedContent) {
    console.log(`Cache hit, url: ${url}`);
    return cachedContent;
  }

  console.log(`Cache miss, url: ${url}`);

  // fetch
  const response = await axiosRetryInstance.get<string>(url);
  const htmlContent = response.data;

  // cache
  await cache.set(url, htmlContent, cacheTtlHours * 60 * 60 * 1000);

  return htmlContent;
};
