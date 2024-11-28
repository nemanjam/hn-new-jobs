import { FC } from 'react';

import LineChartMultiple from '@/components/charts/line-chart-multiple';
import NewOldCompaniesSection from '@/components/new-old-companies-section';

import { getAllMonths, getNewOldCompaniesForMonth } from '@/modules/database/select';
import { statistics } from '@/modules/transform/database';

import { MonthQueryParam } from '@/types/website';

export interface Props extends MonthQueryParam {}

const IndexPage: FC<Props> = async ({ params }) => {
  const allMonths = getAllMonths();

  const { month } = await params; // array for [[...month]]
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
        {/* <LineChartMultiple chartData={lineChartMultipleData} /> */}
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
