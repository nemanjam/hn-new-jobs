import { JSDOM } from 'jsdom';

import { fetchApi } from '@/modules/parser/algolia/fetch-api';
import { getThreadIdFromMonth } from '@/modules/parser/algolia/thread';
import { ALGOLIA } from '@/constants/algolia';

import { AComment, APagination, AThread } from '@/types/algolia';
import type { DbCompanyInsert } from '@/types/database';

const { threadBaseUrl, hitsPerPageMax, companyNameRegex, removeLinkOrBracesRegex } =
  ALGOLIA.comments;

// with hitsPerPage=1000 pagination mostly not needed

export const parseCompaniesForThread = async (threadId: string): Promise<DbCompanyInsert[]> => {
  let allCompanies: DbCompanyInsert[] = [];
  let page = 0;
  let totalPages;

  do {
    const { pageCompanies, pagination } = await parseCompaniesForPage(threadId, page);

    allCompanies = allCompanies.concat(pageCompanies);
    totalPages = pagination.nbPages;
    page++;
  } while (page < totalPages);

  const uniqueCompanies = Array.from(
    new Map(allCompanies.map((company) => [company.name, company])).values()
  );

  return uniqueCompanies;
};

export interface PaginatedPCompanies {
  pageCompanies: DbCompanyInsert[];
  pagination: APagination;
}

export const parseCompaniesForPage = async (
  threadId: string,
  page: number
): Promise<PaginatedPCompanies> => {
  // query params must be in url for cache key
  const threadUrl = `${threadBaseUrl}${threadId}&page=${page}&hitsPerPage=${hitsPerPageMax}`;

  const threadResponse = await fetchApi<AThread>(threadUrl);

  const pagination = {
    page: threadResponse.page,
    nbHits: threadResponse.nbHits,
    nbPages: threadResponse.nbPages,
    hitsPerPage: threadResponse.hitsPerPage,
  };

  const invalidFlag = 'invalid' as const;

  const pageCompanies = threadResponse.hits
    .map((comment: AComment) => {
      const blankCompany: DbCompanyInsert = {
        name: invalidFlag,
        commentId: invalidFlag,
      };

      const { comment_text, objectID, story_id, parent_id } = comment;

      // 1. filter out non-first level comments
      if (parent_id !== story_id) return blankCompany;

      // 2. company name from title

      // get titleText
      const { document } = new JSDOM(comment_text).window;
      const firstNode = document.body.firstChild;

      // is text node and has text content
      const titleText =
        firstNode?.nodeType === 3 && firstNode?.textContent ? firstNode.textContent.trim() : null;

      if (!titleText) return blankCompany;

      // get company name from text
      const match = titleText.match(companyNameRegex);
      let name = match ? match[1].trim() : null;
      if (!name) return blankCompany;

      const urlMatch = name.match(removeLinkOrBracesRegex);
      name = urlMatch ? urlMatch[1].trim() : name;

      // 3. commentId - link
      return { name, commentId: objectID };
    })
    .filter((company) => company.name !== invalidFlag && company.commentId !== invalidFlag);

  return { pageCompanies, pagination };
};
