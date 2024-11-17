import { getNewOldCompaniesForAllMonths } from '@/modules/database/select';

export const allNewOldCompanies = getNewOldCompaniesForAllMonths();

export const lastMonthNewOldCompanies = allNewOldCompanies[0];

export const lastMonthCompanyWithComments = allNewOldCompanies[0].allCompanies;
