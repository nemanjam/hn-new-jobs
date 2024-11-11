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

export interface NewOldCompanies extends MonthPair {
  newCompanies: DbCompany[];
  oldCompanies: DbCompany[];
  firstTimeCompanies: DbCompany[];
}

export interface CompanyComments {
  companyName: string;
  comments: DbCompany[];
}
