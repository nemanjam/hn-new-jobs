import { FC } from 'react';

import BarChartSimple, {
  BarChartSimpleData,
  BarChartSimpleDataItem,
  RangeType,
} from '@/components/charts/bar-chart-simple';
import NewOldCompaniesCard from '@/components/new-old-companies-card';
import NewOldCompaniesList from '@/components/new-old-companies-list';

import {
  getCommentsForLastMonthCompanies,
  getNewOldCompaniesForLastTwoMonths,
} from '@/modules/database/select';
import { createOldMonthName } from '@/libs/datetime';

import { CompanyComments } from '@/types/database';

const ThisMonthPage: FC = () => {
  const newOldCompanies = getNewOldCompaniesForLastTwoMonths();

  const companiesComments = getCommentsForLastMonthCompanies();

  // prerender once into variable in server code
  const getBarChartSimpleData = (companiesComments: CompanyComments[]): BarChartSimpleData => {
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

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          This month&apos;s companies
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          New - old companies statistics for the current month.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <BarChartSimple chartData={getBarChartSimpleData(companiesComments)} />
        <NewOldCompaniesCard newOldCompanies={newOldCompanies} />
        <NewOldCompaniesList newOldCompanies={newOldCompanies} />
      </div>
    </section>
  );
};

export default ThisMonthPage;
