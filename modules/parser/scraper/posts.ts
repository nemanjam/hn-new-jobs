import { JSDOM } from 'jsdom';

import { fetchHtml } from '@/modules/parser/scraper/fetch-html';
import { getThreadPagesUrlsForMonth } from '@/modules/parser/scraper/thread';
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

  const htmlContent = await fetchHtml(pageUrl);
  const doc: Document = new JSDOM(htmlContent).window.document;

  // first level posts
  const postNodes = doc.querySelectorAll<HTMLTableRowElement>(postSelector);

  // todo: throw if postNodes empty

  const companies = [];

  for (const postNode of postNodes) {
    // handle DOM elements first
    const titleNode = postNode.querySelector<HTMLDivElement>(titleChildSelector);
    const linkNode = postNode.querySelector<HTMLAnchorElement>(linkChildSelector);

    // if no element, skip
    if (!(titleNode?.textContent && linkNode)) continue;

    // 1. company name

    const titleText = titleNode.textContent.trim();
    const match = titleText.match(companyNameRegex);
    let name = match ? match[1].trim() : null;
    if (!name) continue;

    const urlMatch = name.match(removeLinkOrBracesRegex);
    name = urlMatch ? urlMatch[1].trim() : name;

    // 2. post link

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

  const uniqueCompanies = Array.from(
    new Map(allCompanies.map((company) => [company.name, company])).values()
  );

  return uniqueCompanies;
};
