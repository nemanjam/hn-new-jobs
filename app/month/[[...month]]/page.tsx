import { FC } from 'react';

import CompaniesCommentsSection from '@/components/companies-comments-section';

import { getAllMonths, getNewOldCompaniesForMonth } from '@/modules/database/select';
import { barChartSimpleData, getBarChartSimpleData } from '@/modules/transform/bar-chart';
import { companyTableData, getCompanyTableData } from '@/modules/transform/companies';

import { MonthQueryParam } from '@/types/api';

export interface Props extends MonthQueryParam {}

const CurrentMonthPage: FC<Props> = async ({ params }) => {
  const allMonths = getAllMonths();

  const { month } = await params;
  const selectedMonth = month?.[0] ?? allMonths[0].name;

  const newOldCompanies = getNewOldCompaniesForMonth(selectedMonth);
  const companyTableData = getCompanyTableData(newOldCompanies.allCompanies);
  const barChartSimpleData = getBarChartSimpleData(newOldCompanies.allCompanies);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Current month&apos;s companies
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          New - old companies statistics for the current month.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <CompaniesCommentsSection
          barChartSimpleData={barChartSimpleData}
          tableData={companyTableData}
          allMonths={allMonths}
          month={selectedMonth}
        />
      </div>
    </section>
  );
};

export default CurrentMonthPage;
