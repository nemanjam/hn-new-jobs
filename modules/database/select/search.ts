import { db } from '@/modules/database/schema';
import { convertCompanyRowType, withCommentsQuery } from '@/modules/database/select/utils';
import { isCompanySearchMinLength } from '@/utils/urls';

import { CompanyWithComments, CompanyWithCommentsAsStrings } from '@/types/database';

export const searchCompanyByName = (name: string): CompanyWithComments[] => {
  if (!isCompanySearchMinLength(name)) return [];

  const companies = db
    .prepare<
      [string],
      CompanyWithCommentsAsStrings
    >(withCommentsQuery(`SELECT c1.* FROM company AS c1 WHERE name LIKE ? GROUP BY c1.name`, 'commentsCount'))
    .all(`%${name}%`)
    .map(convertCompanyRowType);

  return companies;
};
