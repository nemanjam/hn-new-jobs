import {
  getCommentsForLastMonthCompanies,
  getNewOldCompaniesForAllMonths,
  getNewOldCompaniesForLastTwoMonths,
} from '@/modules/database/select';

export const newOldCompanies = getNewOldCompaniesForLastTwoMonths();

export const allNewOldCompanies = getNewOldCompaniesForAllMonths();

// todo: remove
export const companiesComments = getCommentsForLastMonthCompanies();
