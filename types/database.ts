/*-------------------------------- Models ------------------------------*/

import { SORT_COMPANIES_BY } from '@/constants/database';

import { ValueUnion } from '@/types/utils';

// Match database tables exactly.
export interface DbMonth {
  name: string;
  threadId: string;
  createdAtOriginal: string; // string in better-sqlite3, not Date
  createdAt: string;
  updatedAt: string;
}

export interface DbCompany {
  name: string;
  commentId: string;
  monthName: string;
  createdAtOriginal: string;
  createdAt: string;
  updatedAt: string;
}

/*-------------------------------- Insert ------------------------------*/

export interface DbCompanyInsert extends Pick<DbCompany, 'name' | 'commentId'> {
  createdAtOriginal: Date;
}

export interface DbMonthInsert extends Pick<DbMonth, 'name' | 'threadId'> {
  createdAtOriginal: Date;
}

/*-------------------------- Select ------------------------*/

// NOCompanies

export interface MonthPair {
  forMonth: string;
  comparedToMonth: string;
}

export interface MonthRange {
  fromMonth: string;
  toMonth: string;
}

export interface CompanyWithComments {
  company: DbCompany;
  comments: DbCompany[];
}

export interface NewOldCompanies {
  forMonth: DbMonth;
  comparedToMonth: DbMonth;
  firstTimeCompanies: CompanyWithComments[];
  newCompanies: CompanyWithComments[];
  oldCompanies: CompanyWithComments[];
  allCompanies: CompanyWithComments[];
}

export interface CompanyWithCommentsAsStrings {
  // DbCompany
  name: string;
  commentId: string;
  monthName: string;
  createdAtOriginal: string;
  createdAt: string;
  updatedAt: string;
  // comments
  comments: string;
}

export type SortCompaniesBy = ValueUnion<typeof SORT_COMPANIES_BY>;

export interface Statistics {
  monthsCount: number;
  commentsCount: number;
  companiesCount: number;
  firstMonth: DbMonth;
  lastMonth: DbMonth;
}

export interface SearchCompaniesResult {
  companies: CompanyWithComments[];
  hitsCount: number;
}
