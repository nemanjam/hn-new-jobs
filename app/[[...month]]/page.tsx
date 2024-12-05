import { FC } from 'react';

import LineChartMultiple from '@/components/charts/line-chart-multiple';
import Heading from '@/components/heading';
import NewOldCompaniesSection from '@/components/new-old-companies-section';

import { getNewOldCompaniesForMonthCached } from '@/modules/database/select/company';
import { getNewOldCompaniesCountForAllMonthsCached } from '@/modules/database/select/line-chart';
import { getAllMonths } from '@/modules/database/select/month';
import { getStatisticsCached } from '@/modules/database/select/statistics';

import { MonthQueryParam } from '@/types/website';

export interface Props extends MonthQueryParam {}

const IndexPage: FC<Props> = async ({ params }) => {
  const statistics = await getStatisticsCached();
  const lineChartMultipleData = await getNewOldCompaniesCountForAllMonthsCached();

  const allMonths = getAllMonths();

  // array for [[...month]]
  const { month } = await params;
  const selectedMonth = month?.[0] ?? allMonths[0].name;

  const newOldCompanies = await getNewOldCompaniesForMonthCached(selectedMonth);

  const { monthsCount, companiesCount, commentsCount, firstMonth, lastMonth } = statistics ?? {
    firstMonth: {},
    lastMonth: {},
  };
  const statisticsText = statistics
    ? `${monthsCount} months, ${companiesCount} companies, ${commentsCount} jobs`
    : '';

  return (
    <article className="flex flex-col gap-6">
      <Heading
        title={
          <>
            Hackernews new jobs
            {statisticsText && (
              <small className="relative -top-4 align-baseline text-muted-foreground text-base tracking-normal font-semibold ml-2">
                {statisticsText}
              </small>
            )}
          </>
        }
        subTitle={`New and repeated job ads from ${firstMonth.name} to ${lastMonth.name}.`}
      />
      <LineChartMultiple chartData={lineChartMultipleData} />
      <NewOldCompaniesSection
        month={selectedMonth}
        allMonths={allMonths}
        newOldCompanies={newOldCompanies}
      />
    </article>
  );
};

export default IndexPage;
