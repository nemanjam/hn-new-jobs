/*-------------------------------- Models ------------------------------*/

// Match database tables exactly.
export interface DbMonth {
  name: string;
  threadId: string;
  createdAtOriginal: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbCompany {
  name: string;
  commentId: string;
  monthName: string;
  createdAtOriginal: Date;
  createdAt: Date;
  updatedAt: Date;
}

/*-------------------------------- Insert ------------------------------*/

export interface DbCompanyInsert
  extends Pick<DbCompany, 'name' | 'commentId' | 'createdAtOriginal'> {}

export interface DbMonthInsert extends Pick<DbMonth, 'name' | 'threadId' | 'createdAtOriginal'> {}

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
  createdAt: string;
  updatedAt: string;
  // comments
  comments: string;
}

export type SortBy = 'commentsCount' | 'updatedAt';
