export interface Cache {
  urls: Record<string, string>;
}

export interface Company {
  name: string;
  link: string;
}

export interface Thread {
  month: string;
  link: string;
}

export interface MonthPair {
  month1: string;
  month2: string;
}

export interface Months {
  allMonths: string[];
  monthPairs: MonthPair[];
}

export interface NewAndOldCompanies {
  newCompanies: Company[];
  oldCompanies: Company[];
}

export interface Input {
  result: NewAndOldCompanies;
  month1: string;
  month2: string;
}

export interface FormattedResult {
  forMonth: string;
  comparedToMonth: string;
  totalCount: number;
  newCount: number;
  oldCount: number;
  percentageOfNew: string;
  percentageOfOld: string;
  newNames: string[];
  oldNames: string[];
  newCompanies: Company[];
  oldCompanies: Company[];
}
