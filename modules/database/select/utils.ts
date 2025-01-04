import { SORT_COMPANIES_BY } from '@/constants/database';

import {
  CompanyWithComments,
  CompanyWithCommentsAsStrings,
  DbCompany,
  SortCompaniesBy,
} from '@/types/database';

const { createdAtOriginal } = SORT_COMPANIES_BY;

// this was in js filter
export const compareCompanies = (company1: DbCompany, company2: DbCompany): boolean => {
  const isEqual = company1.name === company2.name;

  return isEqual;
};

/**
 * Sort companies by MAX(sc.createdAtOriginal) DESC
 * Sort comments by dc.monthName DESC
 */
export const withCommentsQuery = (
  selectCompanies: string,
  sortByCompanies: SortCompaniesBy = createdAtOriginal
): string =>
  `WITH SelectedCompanies AS (
    ${selectCompanies}
    ),
    DistinctComments AS ( -- mutates SelectedCompanies with join
      SELECT 
        c1.*
      FROM company c1
      INNER JOIN SelectedCompanies sc 
        ON c1.name = sc.name -- include all comments always
    )
    SELECT -- final select, add comments column to sc
      sc.*,
      json_group_array(
        json_object(
          'name', dc.name,
          'monthName', dc.monthName,
          'commentId', dc.commentId,
          'createdAt', dc.createdAt,
          'createdAtOriginal', dc.createdAtOriginal,
          'updatedAt', dc.updatedAt
        ) ORDER BY dc.monthName DESC  -- sort comments
      ) AS comments,
      COUNT(DISTINCT dc.commentId) AS commentsCount  -- must keep for sort
    FROM SelectedCompanies sc 
    INNER JOIN DistinctComments dc
      ON sc.name = dc.name -- restore original SelectedCompanies instance for month
    GROUP BY sc.name
    ORDER BY ${sortByCompanies === createdAtOriginal ? 'MAX(sc.createdAtOriginal)' : 'commentsCount'} DESC -- sort companies by max instance from group by name
    `;

export const convertCompanyRowType = (row: CompanyWithCommentsAsStrings): CompanyWithComments => ({
  company: row,
  comments: JSON.parse(row.comments) as DbCompany[],
});
