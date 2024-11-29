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
    ? `${monthsCount} months, ${companiesCount} companies, ${commentsCount} jobs`
    : '';

  return (
    <section className="container pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2 mb-6">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Hackernews new jobs
          {statisticsText && (
            <small className="relative -top-4 align-baseline text-muted-foreground text-base font-semibold ml-2">
              {statisticsText}
            </small>
          )}
        </h1>
        <p className="text-lg text-muted-foreground flex gap-2">
          New and repeated job ads for every month through the history.
        </p>
      </div>
      <div className="flex flex-col gap-6">
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
