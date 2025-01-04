import { FC } from 'react';
import { notFound } from 'next/navigation';

import LineChartMultiple from '@/components/charts/line-chart-multiple';
import Heading from '@/components/heading';
import NewOldCompaniesSection from '@/components/new-old-companies-section';

import { getNewOldCompaniesForMonth } from '@/modules/database/select/company';
import { getNewOldCompaniesCountForAllMonths } from '@/modules/database/select/line-chart';
import { getAllMonths } from '@/modules/database/select/month';
import { getStatistics } from '@/modules/database/select/statistics';
import { getCacheDatabase, getDynamicCacheKey, getOrComputeValue } from '@/libs/keyv';
import { isValidMonthNameWithDb } from '@/utils/validation';
import { CACHE_KEYS_DATABASE } from '@/constants/cache';
import { METADATA } from '@/constants/metadata';

import { MonthQueryParam } from '@/types/website';

export interface Props extends MonthQueryParam {}

const { title } = METADATA;

const {
  getStatisticsCacheKey,
  getNewOldCompaniesCountForAllMonthsCacheKey,
  getNewOldCompaniesForMonthCacheKey,
} = CACHE_KEYS_DATABASE;

const IndexPage: FC<Props> = async ({ params }) => {
  const statistics = await getOrComputeValue(
    () => getCacheDatabase().get(getStatisticsCacheKey),
    (value) => getCacheDatabase().set(getStatisticsCacheKey, value),
    getStatistics
  );

  // ! must run AT REQUEST time, big problem with stale data
  const lineChartMultipleData = await getOrComputeValue(
    () => getCacheDatabase().get(getNewOldCompaniesCountForAllMonthsCacheKey),
    (value) => getCacheDatabase().set(getNewOldCompaniesCountForAllMonthsCacheKey, value),
    getNewOldCompaniesCountForAllMonths
  );

  const allMonths = getAllMonths();

  // array for [[...month]]
  const { month } = await params;
  const selectedMonth = month?.[0] ?? allMonths[0].name;

  if (!isValidMonthNameWithDb(selectedMonth)) return notFound();

  const newOldCompanies = await getOrComputeValue(
    () =>
      getCacheDatabase().get(getDynamicCacheKey(getNewOldCompaniesForMonthCacheKey, selectedMonth)),
    (value) =>
      getCacheDatabase().set(
        getDynamicCacheKey(getNewOldCompaniesForMonthCacheKey, selectedMonth),
        value
      ),
    getNewOldCompaniesForMonth,
    selectedMonth
  );

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
