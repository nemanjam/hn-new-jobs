import { sleep } from '@/parser/utils';
import { JSDOM } from 'jsdom';

interface Cache {
  url: Record<string, string>;
}

const cache: Cache = { url: {} };

export const getDocumentFromUrl = async (url: string): Promise<Document> => {
  if (!cache.url?.[url]) {
    const response = await fetch(url);
    cache.url[url] = await response.text();
    await sleep(5);
  }

  const htmlContent = cache.url[url];

  // node.js dom
  const dom = new JSDOM(htmlContent);
  return dom.window.document;
};
