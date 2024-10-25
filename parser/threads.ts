import { PARSER } from '@/parser/constants';
import { getDocumentFromUrl } from '@/parser/download';

export interface Thread {
  month: string;
  link: string;
}

export const getThreads = async (): Promise<Thread[]> => {
  const { threadsUrl, threadsSelector, monthRegex } = PARSER.threads;

  const doc = await getDocumentFromUrl(threadsUrl);
  const threadsNodes = doc.querySelectorAll(threadsSelector);

  const threads = [];

  for (const threadNode of threadsNodes) {
    // todo: handle not found and fix types
    const { textContent, href } = threadNode;

    const match = textContent.match(monthRegex);
    const month = match ? match[1].trim() : null;
    if (!month) continue;

    const link = threadNode.href;

    const thread = { month, link };
    threads.push(thread);
  }

  return threads;
};
