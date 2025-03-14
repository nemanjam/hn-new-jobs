import { BarChartSimpleData } from '@/components/charts/bar-chart-simple';

import { createOldMonthName } from '@/libs/datetime';

import { BarChartSimpleDataItem, RangeType } from '@/types/charts';
import { CompanyWithComments } from '@/types/database';

// prerender once into variable in server code
export const getBarChartSimpleData = (
  companiesComments: CompanyWithComments[]
): BarChartSimpleData => {
  const items: BarChartSimpleDataItem[] = [
    { range: '1', count: 0, fill: 'var(--color-1)' },
    { range: '2-3', count: 0, fill: 'var(--color-2-3)' },
    { range: '4-5', count: 0, fill: 'var(--color-4-5)' },
    { range: '6-7', count: 0, fill: 'var(--color-6-7)' },
    { range: '8-12', count: 0, fill: 'var(--color-8-12)' },
  ];

  const getItem = (range: RangeType) =>
    items.find((item) => item.range === range) as BarChartSimpleDataItem;

  const monthName = companiesComments[0].company.monthName;

  companiesComments.forEach((companyComments) => {
    const { company, comments } = companyComments;
    const { monthName } = company;

    // ! number of ads in the previous 12 months
    const _12mOldMonthName = createOldMonthName(monthName, 12);

    const commentsCount = comments.filter(
      (comment) => comment.monthName >= _12mOldMonthName && comment.monthName <= monthName
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
