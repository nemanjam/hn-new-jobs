import { FC } from 'react';

import LineChartMultiple from '@/components/charts/line-chart-multiple';
import NewOldCompaniesSection from '@/components/new-old-companies-section';

import { getNewOldCompaniesForMonth } from '@/modules/database/select/company';
import { getNewOldCompaniesCountForAllMonths } from '@/modules/database/select/line-chart';
import { getAllMonths } from '@/modules/database/select/month';
import { getStatistics } from '@/modules/database/select/statistics';

import { MonthQueryParam } from '@/types/website';

export interface Props extends MonthQueryParam {}

const IndexPage: FC<Props> = async ({ params }) => {
  const statistics = getStatistics();
  const lineChartMultipleData = getNewOldCompaniesCountForAllMonths();

  const allMonths = getAllMonths();

  // array for [[...month]]
  const { month } = await params;
  const selectedMonth = month?.[0] ?? allMonths[0].name;

  const newOldCompanies = getNewOldCompaniesForMonth(selectedMonth);

  const { monthsCount, companiesCount, commentsCount } = statistics ?? {};
  const statisticsText = statistics
    ? `${monthsCount} months, ${companiesCount} companies, ${commentsCount} job ads.`
    : '';

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Hackernews new jobs
        </h1>
        <p className="text-lg text-muted-foreground flex gap-2">
          First time, new and old job ads for every month through the history. {statisticsText}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <LineChartMultiple chartData={lineChartMultipleData} />
        <NewOldCompaniesSection
          month={selectedMonth}
          allMonths={allMonths}
          newOldCompanies={newOldCompanies}
        />
      </div>
    </section>
  );
};

export default IndexPage;
