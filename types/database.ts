/*-------------------------------- Models ------------------------------*/

// Match database tables exactly.
export interface DbMonth {
  name: string;
  threadId: string;
  createdAt: Date;
}

export interface DbCompany {
  name: string;
  commentId: string;
  monthName: string;
  createdAt: Date;
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

export interface NewOldCompanies extends MonthPair {
  newCompanies: DbCompany[];
  oldCompanies: DbCompany[];
  /** todo: First time appearing companies. */
  firstTimeCompanies?: DbCompany[];
}

export interface CompanyComments {
  companyName: string;
  comments: DbCompany[];
}
