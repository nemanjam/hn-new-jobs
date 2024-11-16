import { LineChartMultipleData } from '@/components/charts/line-chart-multiple';

import { allNewOldCompanies } from '@/modules/transform/database';

import { NewOldCompanies } from '@/types/database';

const getLineChartMultipleData = (allNewOldCompanies: NewOldCompanies[]): LineChartMultipleData[] =>
  allNewOldCompanies
    .map((month) => {
      const { forMonth, firstTimeCompanies, newCompanies, oldCompanies, allCompanies } = month;

      return {
        monthName: forMonth.name,
        firstTimeCompaniesCount: firstTimeCompanies.length,
        newCompaniesCount: newCompanies.length,
        oldCompaniesCount: oldCompanies.length,
        totalCompaniesCount: allCompanies.length,
      };
    })
    .reverse();

export const lineChartMultipleData = getLineChartMultipleData(allNewOldCompanies);
