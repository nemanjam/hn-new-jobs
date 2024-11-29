import { FC } from 'react';

import CompaniesCommentsSection from '@/components/companies-comments-section';

import { getNewOldCompaniesForMonth } from '@/modules/database/select/company';
import { getAllMonths } from '@/modules/database/select/month';
import { getBarChartSimpleData } from '@/modules/transform/bar-chart';
import { getCompanyTableData } from '@/modules/transform/table';

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
    <section className="container pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2 mb-6">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Current month&apos;s companies
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          New - old companies statistics for the current month.
        </p>
      </div>
      <div className="flex flex-col gap-6">
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
