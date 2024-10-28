import { JSDOM } from 'jsdom';

import { sleep } from '@/utils/sleep';
import { CONFIG } from '@/config/parser';

import type { Cache } from '@/types/parser';

const { fetchWaitSeconds } = CONFIG;

// todo: cache to files
const cache: Cache = { urls: {} };

export const fetchHtmlDocumentFromUrl = async (
  url: string
): Promise<Document> => {
  if (!cache.urls?.[url]) {
    const response = await fetch(url);
    cache.urls[url] = await response.text();
    await sleep(fetchWaitSeconds);
  }

  const htmlContent = cache.urls[url];

  // node.js dom
  const dom = new JSDOM(htmlContent);
  return dom.window.document;
};
