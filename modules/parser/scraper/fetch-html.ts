import { JSDOM } from 'jsdom';
import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

import { sleep } from '@/utils/sleep';
import { CONFIG } from '@/config/parser';

const { fetchWaitSeconds, cacheFilePath, cacheTtlHours } = CONFIG;

const cache = new Keyv({
  store: new KeyvFile({ filename: cacheFilePath }),
});

export const fetchHtml = async (url: string): Promise<Document> => {
  try {
    // check cache
    const cachedContent = await cache.get(url);
    if (cachedContent) {
      return new JSDOM(cachedContent).window.document;
    }

    // fetch
    const response = await fetch(url);
    const htmlContent = await response.text();

    // cache
    await cache.set(url, htmlContent, cacheTtlHours * 60 * 60 * 1000); // TTL in milliseconds

    // throttle only fetch
    await sleep(fetchWaitSeconds);

    return new JSDOM(htmlContent).window.document;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
};
