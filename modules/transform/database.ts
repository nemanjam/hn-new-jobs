import {
  getCommentsForLastMonthCompanies,
  getNewOldCompaniesForLastTwoMonths,
} from '@/modules/database/select';

export const newOldCompanies = getNewOldCompaniesForLastTwoMonths();
export const companiesComments = getCommentsForLastMonthCompanies();
