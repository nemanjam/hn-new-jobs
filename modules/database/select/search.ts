import { db } from '@/modules/database/schema';
import { convertCompanyRowType, withCommentsQuery } from '@/modules/database/select/utils';
import { isCompanySearchMinLength } from '@/utils/urls';
import { SERVER_CONFIG } from '@/config/server';

import { CompanyWithCommentsAsStrings, SearchCompaniesResult } from '@/types/database';

const { searchCompaniesLimit } = SERVER_CONFIG;

export const searchCompanyByName = (name: string): SearchCompaniesResult => {
  const emptyResult = { hitsCount: 0, companies: [] };
  const searchParam = `%${name}%`;

  if (!isCompanySearchMinLength(name)) return emptyResult;

  const hitsCount =
    db
      .prepare<
        [string],
        { count: number }
      >(`SELECT COUNT(DISTINCT name) AS count FROM company WHERE name LIKE ?`)
      .get(searchParam)?.count ?? 0;

  if (!(hitsCount > 0)) return emptyResult;

  const companies = db
    .prepare<
      [string, number],
      CompanyWithCommentsAsStrings
    >(withCommentsQuery(`SELECT c1.* FROM company AS c1 WHERE name LIKE ? GROUP BY c1.name LIMIT ?`, 'commentsCount'))
    .all(searchParam, searchCompaniesLimit)
    .map(convertCompanyRowType);

  const searchResult = { hitsCount, companies };

  return searchResult;
};
