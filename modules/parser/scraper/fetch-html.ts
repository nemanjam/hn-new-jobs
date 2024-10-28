import { JSDOM } from 'jsdom';

import { sleep } from '@/utils/sleep';

import type { Cache } from '@/types/parser';

const cache: Cache = { urls: {} };

export const getDocumentFromUrl = async (url: string): Promise<Document> => {
  if (!cache.urls?.[url]) {
    const response = await fetch(url);
    cache.urls[url] = await response.text();
    await sleep(5);
  }

  const htmlContent = cache.urls[url];

  // node.js dom
  const dom = new JSDOM(htmlContent);
  return dom.window.document;
};
