// CompanyTable;

import { CompanyTable } from '@/components/companies-comments-columns';
import { CompanyTableDataWithMonth } from '@/components/companies-comments-table';

import { getMonthByName } from '@/modules/database/select';
import { companiesComments } from '@/modules/transform/database';

import { CompanyComments } from '@/types/database';

const getCompanyTableData = (companiesComments: CompanyComments[]): CompanyTableDataWithMonth => {
  const { monthName } = companiesComments[0].company;
  const month = getMonthByName(monthName);
  const { name, threadId } = month!;

  const data: CompanyTable[] = companiesComments.map((companyComments) => {
    const { company, comments } = companyComments;
    const { name, commentId } = company;

    return {
      company: { name, commentId },
      commentsCount: comments.length,
      comments: comments.map(({ commentId, monthName }) => ({ commentId, monthName })),
    };
  });

  return { month: { name, threadId }, data };
};

export const companyTableData = getCompanyTableData(companiesComments);
