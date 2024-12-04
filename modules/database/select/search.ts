import { getDb } from '@/modules/database/schema';
import { convertCompanyRowType, withCommentsQuery } from '@/modules/database/select/utils';
import { isCompanySearchMinLength } from '@/utils/urls';
import { SORT_COMPANIES_BY } from '@/constants/database';
import { SERVER_CONFIG } from '@/config/server';

import { CompanyWithCommentsAsStrings, SearchCompaniesResult } from '@/types/database';

const { searchCompaniesLimit } = SERVER_CONFIG;

const { commentsCount } = SORT_COMPANIES_BY;

export const searchCompanyByName = (name: string): SearchCompaniesResult => {
  const emptyResult = { hitsCount: 0, companies: [] };
  const searchParam = `%${name}%`;

  if (!isCompanySearchMinLength(name)) return emptyResult;

  const allCompanies = getDb()
    .prepare<
      [string],
      CompanyWithCommentsAsStrings
    >(withCommentsQuery(`SELECT c1.* FROM company AS c1 WHERE name LIKE ? GROUP BY c1.name`, commentsCount))
    .all(searchParam)
    .map(convertCompanyRowType);

  const hitsCount = allCompanies.length;

  // important: must use slice for correct sorting by commentsCount to take entire set
  const companies = allCompanies.slice(0, searchCompaniesLimit);

  const searchResult = { hitsCount, companies };

  return searchResult;
};
