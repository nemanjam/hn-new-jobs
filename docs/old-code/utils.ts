import {
  CompanyWithComments,
  CompanyWithCommentsAsStrings,
  DbCompany,
  SortBy,
} from '@/types/database';

// this was in js filter
export const compareCompanies = (company1: DbCompany, company2: DbCompany): boolean => {
  const isEqual = company1.name === company2.name;

  return isEqual;
};

export const __withCommentsQuery = (innerQuery: string, sortBy: SortBy): string =>
  `WITH SelectedCompanies AS (
      ${innerQuery}
    )
    SELECT 
      c.name,
      c.commentId,
      c.monthName,
      c.createdAt,
      c.updatedAt,
      json_group_array(
        json_object(
          'name', c.name,
          'monthName', c.monthName,
          'commentId', c.commentId,
          'createdAt', c.createdAt,
          'updatedAt', c.updatedAt
        ) ORDER BY c.monthName DESC  -- sorts comments
      ) AS comments,
      COUNT(c.commentId) AS commentsCount  -- must keep for sort
    FROM company c
    INNER JOIN SelectedCompanies sc ON c.name = sc.name
    GROUP BY c.name
    ORDER BY ${sortBy === 'createdAtOriginal' ? 'c.createdAtOriginal' : 'commentsCount'} DESC;  -- sorts companies
    `;

export const withCommentsQuery = (innerQuery: string, sortBy: SortBy): string =>
  `WITH SelectedCompanies AS (
    ${innerQuery}
    ),
    DistinctComments AS (
      SELECT 
        c1.name,
        c1.monthName, 
        c1.commentId,
        c1.createdAtOriginal,
        c1.createdAt, 
        c1.updatedAt,
        ROW_NUMBER() OVER (PARTITION BY c1.commentId ORDER BY c1.createdAt DESC) as rn
      FROM company c1
      INNER JOIN SelectedCompanies sc ON c1.name = sc.name
    )
    SELECT
      dc.name,
      dc.commentId,
      dc.monthName,
      dc.createdAt,
      dc.updatedAt,
      json_group_array(
        json_object(
          'name', dc.name,
          'monthName', dc.monthName,
          'commentId', dc.commentId,
          'createdAt', dc.createdAt,
          'updatedAt', dc.updatedAt
        ) ORDER BY dc.monthName DESC
      ) AS comments,
      COUNT(DISTINCT dc.commentId) AS commentsCount
    FROM DistinctComments dc
    WHERE dc.rn = 1
    GROUP BY dc.name
    ORDER BY ${sortBy === 'createdAtOriginal' ? 'dc.createdAtOriginal' : 'commentsCount'} DESC;
    `;

export const convertCompanyRowType = (row: CompanyWithCommentsAsStrings): CompanyWithComments => ({
  company: {
    name: row.name,
    commentId: row.commentId,
    monthName: row.monthName,
    createdAtOriginal: new Date(row.createdAtOriginal),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  },
  comments: JSON.parse(row.comments) as DbCompany[],
});
