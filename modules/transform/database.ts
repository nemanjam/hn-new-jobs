import {
  getCommentsForLastMonthCompanies,
  getNewOldCompaniesForAllMonths,
  getNewOldCompaniesForLastTwoMonths,
} from '@/modules/database/select';

export const newOldCompanies = getNewOldCompaniesForLastTwoMonths();

export const allNewOldCompanies = getNewOldCompaniesForAllMonths();

export const companiesComments = getCommentsForLastMonthCompanies();
