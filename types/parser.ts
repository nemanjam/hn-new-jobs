import type { DbCompany } from '@/types/database';

/*-------------------------- database wrappers ------------------------*/

export interface PMonth {
  name: string;
  companies: PCompany[];
}

export interface PCompany {
  name: string;
  commentId: string;
}

/*-------------------- get old new companies from db ------------------*/

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

/*------------------ old parser -----------------*/

export interface Thread {
  month: string;
  threadId: string;
}

/*------------------ bellow old parser outdated -----------------*/

export interface Input {
  result: NOCompanies;
  month1: string;
  month2: string;
}

export interface FormattedResult {
  forMonth: string;
  comparedToMonth: string;
  newCompanies: Company[];
  oldCompanies: Company[];
  // calculated
  newCount: number;
  oldCount: number;
  totalCount: number;
  percentageOfNew: string;
  percentageOfOld: string;
  // repeated
  newNames: string[];
  oldNames: string[];
}
