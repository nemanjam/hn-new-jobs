import { getNewOldCompaniesForAllMonths, getStatistics } from '@/modules/database/select';

/** sorted by createdAtOriginal */
export const allNewOldCompanies = getNewOldCompaniesForAllMonths();

export const lastMonthNewOldCompanies = allNewOldCompanies[0];

export const lastMonthCompanyWithComments = allNewOldCompanies[0].allCompanies;

export const statistics = getStatistics();
