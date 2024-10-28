import { Company } from '@/parser/scraper/posts';

export interface NewAndOldCompanies {
  newCompanies: Company[];
  oldCompanies: Company[];
}

export const compareCompanies = (
  company1: Company,
  company2: Company
): boolean => {
  const isEqual = company1.name === company2.name;
  // console.log('isEqual: ', isEqual, `${company1.name} === ${company2.name}`);

  return isEqual;
};

export const getNewAndOldCompanies = (
  companies1: Company[],
  companies2: Company[]
): NewAndOldCompanies => {
  const newCompanies = [];
  const oldCompanies = [];

  for (const company2 of companies2) {
    let isNew = true;
    for (const company1 of companies1) {
      const isEqual = compareCompanies(company1, company2);
      if (isEqual) {
        isNew = false;
        break;
      }
    }

    if (isNew) newCompanies.push(company2);
    else oldCompanies.push(company2);
  }

  const result = { newCompanies, oldCompanies };
  return result;
};
