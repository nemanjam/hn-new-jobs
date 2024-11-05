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
  month1: string;
  month2: string;
}

export interface Months {
  allMonths: string[];
  monthPairs: MonthPair[];
}

export interface MonthsPair {
  forMonth: string;
  comparedToMonth: string;
}

export interface NOCompanies extends MonthsPair {
  newCompanies: DbCompany[];
  oldCompanies: DbCompany[];
  /** todo: First time appearing companies. */
  firstTimeCompanies?: DbCompany[];
}

export interface CompanyMonths {
  companyName: string;
  allMonths: DbCompany[];
}
