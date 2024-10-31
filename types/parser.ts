/*-------------------------- database wrappers ------------------------*/

import type { DbCompany } from '@/types/database';

export interface PMonth {
  name: string;
  createdAt: Date;
  companies: PCompany[];
}

export interface PCompany {
  name: string;
  link: string;
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
  forMonthName: string;
  comparedToMonthName: string;
}

export interface NewAndOldCompanies extends MonthsPair {
  newCompanies: DbCompany[];
  oldCompanies: DbCompany[];
}

export interface CompanyMonths {
  companyName: string;
  allMonths: DbCompany[];
}

/*------------------ old parser -----------------*/

export interface Thread {
  month: string;
  link: string;
}

/*------------------ bellow old parser outdated -----------------*/

export interface Input {
  result: NewAndOldCompanies;
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
