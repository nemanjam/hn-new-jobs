import { SCRAPER } from '@/parser/scraper/constants';
import { getDocumentFromUrl } from '@/parser/scraper/fetch-html';
import { getThreadPagesUrlsForMonth } from '@/parser/scraper/thread';

export interface Company {
  name: string;
  link: string;
}

export const getCompaniesForPage = async (
  pageUrl: string
): Promise<Company[]> => {
  const {
    postSelector,
    titleChildSelector,
    linkChildSelector,
    companyNameRegex,
    removeLinkOrBracesRegex,
  } = SCRAPER.companies;

  const doc = await getDocumentFromUrl(pageUrl);
  const postNodes = doc.querySelectorAll(postSelector);

  const companies = [];

  for (const postNode of postNodes) {
    const titleNode = postNode.querySelector(titleChildSelector);
    if (!titleNode) continue;

    const titleText = titleNode.textContent.trim();
    const match = titleText.match(companyNameRegex);
    let name = match ? match[1].trim() : null;
    if (!name) continue;

    const urlMatch = name.match(removeLinkOrBracesRegex);
    name = urlMatch ? urlMatch[1].trim() : name;

    const linkNode = postNode.querySelector(linkChildSelector);
    const link = linkNode.href;

    const company = { name, link };
    companies.push(company);
  }

  return companies;
};

/** Main function that returns parsed companies for a month. */

export const getCompaniesForThread = async (
  threadUrl: string
): Promise<Company[]> => {
  const pagesUrls = await getThreadPagesUrlsForMonth(threadUrl);

  const allCompanies = [];

  for (const pageUrl of pagesUrls) {
    const companies = await getCompaniesForPage(pageUrl);
    allCompanies.push(...companies);
  }

  return allCompanies;
};
