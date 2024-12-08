import { FC } from 'react';
import { notFound } from 'next/navigation';

import BarChartSimple from '@/components/charts/bar-chart-simple';
import CompaniesCommentsTable from '@/components/companies-comments-table';
import Heading from '@/components/heading';

import { getNewOldCompaniesForMonthCached } from '@/modules/database/select/company';
import { getAllMonths } from '@/modules/database/select/month';
import { getBarChartSimpleData } from '@/modules/transform/bar-chart';
import { getCompanyTableData } from '@/modules/transform/table';
import { isValidMonthNameWithDb } from '@/utils/validation';

import { MonthQueryParam } from '@/types/api';

export interface Props extends MonthQueryParam {}

const CurrentMonthPage: FC<Props> = async ({ params }) => {
  const allMonths = getAllMonths();

  const { month } = await params;
  const selectedMonth = month?.[0] ?? allMonths[0].name;

  if (!isValidMonthNameWithDb(selectedMonth)) return notFound();

  const newOldCompanies = await getNewOldCompaniesForMonthCached(selectedMonth);
  const companyTableData = getCompanyTableData(newOldCompanies.allCompanies);
  const barChartSimpleData = getBarChartSimpleData(newOldCompanies.allCompanies);

  return (
    <article className="flex flex-col gap-6">
      <Heading
        title="Current month"
        subTitle="New and old companies statistics for the current month."
      />
      <BarChartSimple chartData={barChartSimpleData} allMonths={allMonths} month={selectedMonth} />
      <CompaniesCommentsTable tableData={companyTableData} />
    </article>
  );
};

export default CurrentMonthPage;
