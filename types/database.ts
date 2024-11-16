/*-------------------------------- Models ------------------------------*/

// Match database tables exactly.
export interface DbMonth {
  name: string;
  threadId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbCompany {
  name: string;
  commentId: string;
  monthName: string;
  createdAt: Date;
  updatedAt: Date;
}

/*-------------------------------- Insert ------------------------------*/

export interface DbCompanyInsert extends Pick<DbCompany, 'name' | 'commentId'> {}

export interface DbMonthInsert extends Pick<DbMonth, 'name' | 'threadId'> {}

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
