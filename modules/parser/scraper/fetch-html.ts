import axios from 'axios';
import { JSDOM } from 'jsdom';
import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

import { sleep } from '@/utils/sleep';
import { CONFIG } from '@/config/parser';

import type { AxiosError } from 'axios';

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
    const response = await axios.get(url);
    const htmlContent = await response.data;

    // cache
    await cache.set(url, htmlContent, cacheTtlHours * 60 * 60 * 1000); // TTL in milliseconds

    // throttle only fetch
    await sleep(fetchWaitSeconds);

    return new JSDOM(htmlContent).window.document;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw handleAxiosError(error);
    } else {
      const message = `Unknown fetchHtml error. ${error}`;
      console.error(message);
      throw new Error(message);
    }
  }
};

const handleAxiosError = (error: AxiosError): Error => {
  const { response } = error;
  let message;

  if (response) {
    message = `Axios response error. Status: ${response.status}, Message: ${response.statusText}, Data: ${response.data}`;
  } else if (error.request) {
    message = `Axios no response error. Request: ${JSON.stringify(error.request)}`;
  } else {
    message = `Axios request error. ${error.message}`;
  }

  console.error(message);

  return new Error(message);
};
