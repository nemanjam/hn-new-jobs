import { PARSER } from '@/parser/constants';
import { getDocumentFromUrl } from '@/parser/download';
import { getThreadPagesUrlsForMonth } from '@/parser/thread';

export interface Company {
  name: string;
  link: string;
}

export const getCompaniesForPage = async (
  pageUrl: string
): Promise<Company[]> => {
  const {
    postsSelector,
    titleChildSelector,
    linkChildSelector,
    companyNameRegex,
    removeLinkOrBracesRegex,
  } = PARSER.companies;

  const doc = await getDocumentFromUrl(pageUrl);
  const postsNodes = doc.querySelectorAll(postsSelector);

  const companies = [];

  for (const postNode of postsNodes) {
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
