import fs from 'fs';

import axios from 'axios';
import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

import { axiosInstance, handleAxiosError } from '@/libs/axios';
import { sleep } from '@/utils/sleep';
import { CONFIG } from '@/config/parser';

const { fetchWaitSeconds, cacheFilePath, cacheTtlHours, resultFolder, fileNames } = CONFIG;

// disables cache for testing
try {
  fs.unlinkSync(cacheFilePath);
} catch (error) {}

const cache = new Keyv({
  store: new KeyvFile({ filename: cacheFilePath }),
});

export const fetchHtml = async (url: string): Promise<string> => {
  try {
    // check cache
    const cachedContent = await cache.get<string>(url);
    if (cachedContent) {
      console.log(`Cache hit, url: ${url}`);
      return cachedContent;
    }

    console.log(`Cache miss, url: ${url}`);

    // fetch
    const response = await axiosInstance.get<string>(url);
    const htmlContent = response.data;

    // cache
    await cache.set(url, htmlContent, cacheTtlHours * 60 * 60 * 1000);

    // throttle only fetch
    await sleep(fetchWaitSeconds);

    return htmlContent;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
      // must throw here to prevent bellow
    }

    const message = `Unknown fetchHtml error. ${error}`;
    console.error(message, error);
    throw new Error(message);
  }
};
