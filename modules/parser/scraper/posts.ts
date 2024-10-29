import { fetchHtml } from '@/modules/parser/scraper/fetch-html';
import { getThreadPagesUrlsForMonth } from '@/modules/parser/scraper/thread';
import { SCRAPER } from '@/constants/scraper';

import type { Company } from '@/types/parser';

export const getCompaniesForPage = async (pageUrl: string): Promise<Company[]> => {
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

export const getCompaniesForThread = async (threadUrl: string): Promise<Company[]> => {
  const pagesUrls = await getThreadPagesUrlsForMonth(threadUrl);

  const allCompanies = [];

  for (const pageUrl of pagesUrls) {
    const companies = await getCompaniesForPage(pageUrl);
    allCompanies.push(...companies);
  }

  return allCompanies;
};
