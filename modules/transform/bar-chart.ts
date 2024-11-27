import {
  BarChartSimpleData,
  BarChartSimpleDataItem,
  RangeType,
} from '@/components/charts/bar-chart-simple';

import { allNewOldCompanies } from '@/modules/transform/database';
import { createOldMonthName } from '@/libs/datetime';

import { CompanyWithComments } from '@/types/database';

// prerender once into variable in server code
export const getBarChartSimpleData = (
  companiesComments: CompanyWithComments[]
): BarChartSimpleData => {
  const items: BarChartSimpleDataItem[] = [
    { range: '1', count: 0 },
    { range: '2-3', count: 0 },
    { range: '4-5', count: 0 },
    { range: '6-7', count: 0 },
    { range: '8-12', count: 0 },
  ];

  const getItem = (range: RangeType) =>
    items.find((item) => item.range === range) as BarChartSimpleDataItem;

  const monthName = companiesComments[0].company.monthName;

  companiesComments.forEach((companyComments) => {
    const { company, comments } = companyComments;
    const { monthName } = company;

    const _12mOldMonthName = createOldMonthName(monthName, 12);

    const commentsCount = comments.filter(
      (comment) => comment.monthName >= _12mOldMonthName
    ).length;

    switch (true) {
      case commentsCount === 1:
        getItem('1').count++;
        break;
      case commentsCount === 2 || commentsCount === 3:
        getItem('2-3').count++;
        break;
      case commentsCount === 4 || commentsCount === 5:
        getItem('4-5').count++;
        break;
      case commentsCount === 6 || commentsCount === 7:
        getItem('6-7').count++;
        break;
      case commentsCount > 7:
        getItem('8-12').count++;
        break;
    }
  });

  return { monthName, items };
};

/** For all months. */
export const barChartSimpleData = allNewOldCompanies.map((newOldCompanies) =>
  getBarChartSimpleData(newOldCompanies.allCompanies)
);
