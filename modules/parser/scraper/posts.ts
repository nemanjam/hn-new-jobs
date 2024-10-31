import { fetchHtml } from '@/modules/parser/scraper/fetch-html';
import { getThreadPagesUrlsForMonth, getThreadUrlFromMonth } from '@/modules/parser/scraper/thread';
import { SCRAPER } from '@/constants/scraper';

import type { PCompany } from '@/types/parser';

export const parseCompaniesForPage = async (pageUrl: string): Promise<PCompany[]> => {
  const {
    postSelector,
    titleChildSelector,
    linkChildSelector,
    companyNameRegex,
    removeLinkOrBracesRegex,
  } = SCRAPER.companies;

  const doc = await fetchHtml(pageUrl);
  const postNodes = doc.querySelectorAll<HTMLTableRowElement>(postSelector);

  // todo: throw if postNodes empty

  const companies = [];

  for (const postNode of postNodes) {
    // handle DOM elements first
    const titleNode = postNode.querySelector<HTMLDivElement>(titleChildSelector);
    const linkNode = postNode.querySelector<HTMLAnchorElement>(linkChildSelector);

    // if no element, skip
    if (!(titleNode?.textContent && linkNode)) continue;

    const titleText = titleNode.textContent.trim();
    const match = titleText.match(companyNameRegex);
    let name = match ? match[1].trim() : null;
    if (!name) continue;

    const urlMatch = name.match(removeLinkOrBracesRegex);
    name = urlMatch ? urlMatch[1].trim() : name;

    const link = linkNode.href;

    const company = { name, link };
    companies.push(company);
  }

  return companies;
};

/** Main function that returns parsed companies for a month. */

export const parseCompaniesForThread = async (threadUrl: string): Promise<PCompany[]> => {
  const pagesUrls = await getThreadPagesUrlsForMonth(threadUrl);

  const allCompanies: PCompany[] = [];

  for (const pageUrl of pagesUrls) {
    const companies = await parseCompaniesForPage(pageUrl);
    allCompanies.push(...companies);
  }

  return allCompanies;
};

// todo: parse for new unparsed month
export const parseCompaniesForMonth = async (month: string): Promise<Company[]> => {
  const threadUrl = await getThreadUrlFromMonth(month);
  const companies = await parseCompaniesForThread(threadUrl);
  return companies;
};

export const parseNewMonth = async (): Promise<void> => {
  //
};
