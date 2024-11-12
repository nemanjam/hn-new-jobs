import { DbCompany } from '@/types/database';

// this was in js filter
export const compareCompanies = (company1: DbCompany, company2: DbCompany): boolean => {
  const isEqual = company1.name === company2.name;

  return isEqual;
};
