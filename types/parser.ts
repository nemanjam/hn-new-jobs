/*------------------ database -----------------*/

export interface Company {
  name: string;
  link: string;
}

// tables don't need types
export interface Month {
  name: string;
  companies: Company[];
  createdAt: Date;
}

/*------------------ parser -----------------*/

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
