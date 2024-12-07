/*-------------------------------- schema ------------------------------*/

export interface Month {
  name: string; // pk
  companies: Company[]; // references Company 1:N
}

export interface Company {
  name: string;
  link: string;
}

/*-------------------------------- inserts ------------------------------*/

export const parseNewMonth = async (): Promise<void> => {
  //
};

// sliding window insert, pagination
export const parseFromToMonths = async (): Promise<void> => {
  //
};

/*-------------------------------- queries ------------------------------*/

// db
export const compareTwoMonths = async () => {
  //
};

export const compareLastTwoSubsequentMonths = async () => {
  // compareTwoMonths
};

// pagination
export const compareFromToSubsequentMonthPairs = async () => {
  // compareTwoMonths
};

export const getMonthsForLastMonthsCompanies = async () => {
  // get months for each of last month companies
};
