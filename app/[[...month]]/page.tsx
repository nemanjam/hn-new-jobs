import { FC } from 'react';
import { notFound } from 'next/navigation';

import LineChartMultiple from '@/components/charts/line-chart-multiple';
import Heading from '@/components/heading';
import NewOldCompaniesSection from '@/components/new-old-companies-section';

import { getNewOldCompaniesForMonthCached } from '@/modules/database/select/company';
import { clearCacheIfDatabaseUpdated } from '@/modules/database/select/is-updated';
import { getNewOldCompaniesCountForAllMonthsCached } from '@/modules/database/select/line-chart';
import { getAllMonths } from '@/modules/database/select/month';
import { getStatisticsCached } from '@/modules/database/select/statistics';
import { isValidMonthNameWithDb } from '@/utils/validation';
import { METADATA } from '@/constants/metadata';

import { MonthQueryParam } from '@/types/website';

export interface Props extends MonthQueryParam {}

const { title } = METADATA;

const IndexPage: FC<Props> = async ({ params }) => {
  await clearCacheIfDatabaseUpdated();

  const statistics = await getStatisticsCached();
  const lineChartMultipleData = await getNewOldCompaniesCountForAllMonthsCached();

  const allMonths = getAllMonths();

  // array for [[...month]]
  const { month } = await params;
  const selectedMonth = month?.[0] ?? allMonths[0].name;

  if (!isValidMonthNameWithDb(selectedMonth)) return notFound();

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
            {title}
            {statisticsText && (
              <small className="hidden md:inline-block relative -top-4 align-baseline text-muted-foreground text-base tracking-normal font-semibold ml-2">
                {statisticsText}
              </small>
            )}
          </>
        }
        subTitle={
          <>
            <span className="hidden md:inline">
              {`New and repeated job ads from ${firstMonth.name} to ${lastMonth.name}.`}
            </span>
            <span className="inline md:hidden">
              {`New and repeated job ads from ${firstMonth.name} to ${lastMonth.name}. ${statisticsText}.`}
            </span>
          </>
        }
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
