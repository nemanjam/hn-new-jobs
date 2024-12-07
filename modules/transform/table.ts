import { CompanyTable } from '@/components/companies-comments-columns';
import { CompanyTableDataWithMonth } from '@/components/companies-comments-table';

import { getMonthByName } from '@/modules/database/select/month';

import { CompanyWithComments } from '@/types/database';

export const getCompanyTableData = (
  companiesComments: CompanyWithComments[]
): CompanyTableDataWithMonth => {
  const { monthName } = companiesComments[0].company;
  const month = getMonthByName(monthName);
  const { name, threadId } = month!;

  const data: CompanyTable[] = companiesComments.map((companyComments) => {
    const { company, comments } = companyComments;
    const { name, commentId, createdAtOriginal } = company;

    return {
      company: { name, commentId, createdAtOriginal },
      commentsCount: comments.length,
      comments: comments.map(({ commentId, monthName, createdAtOriginal }) => ({
        commentId,
        monthName,
        createdAtOriginal,
      })),
    };
  });

  return { month: { name, threadId }, data };
};
