import fs from 'fs';
import { join } from 'path';

import axios from 'axios';
import { JSDOM } from 'jsdom';
import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

import { axiosInstance, handleAxiosError } from '@/libs/axios';
import { sleep } from '@/utils/sleep';
import { CONFIG } from '@/config/parser';

const { fetchWaitSeconds, cacheFilePath, cacheTtlHours, resultFolder, fileNames } = CONFIG;

// disables cache for testing
try {
  fs.unlinkSync(cacheFilePath);
  const filePath = join(resultFolder, fileNames.outputLastTwoMoths);
  fs.unlinkSync(filePath);
} catch (error) {}

const cache = new Keyv({
  store: new KeyvFile({ filename: cacheFilePath }),
});

export const fetchHtml = async (url: string): Promise<Document> => {
  try {
    // check cache
    const cachedContent = await cache.get(url);
    if (cachedContent) {
      console.log(`Cache hit, url: ${url}`);
      return new JSDOM(cachedContent).window.document;
    }

    console.log(`Cache miss, url: ${url}`);

    // fetch
    const response = await axiosInstance.get<string>(url);
    const htmlContent = response.data;

    // cache
    await cache.set(url, htmlContent, cacheTtlHours * 60 * 60 * 1000);

    // throttle only fetch
    await sleep(fetchWaitSeconds);

    return new JSDOM(htmlContent).window.document;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw handleAxiosError(error);
    }

    const message = `Unknown fetchHtml error. ${error}`;
    console.error(message, error);
    throw new Error(message);
  }
};
