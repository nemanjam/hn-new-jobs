import { FC } from 'react';

import CompaniesCommentsSection from '@/components/companies-comments-section';

import { companyTableData } from '@/modules/transform/companies';
import { barChartSimpleData } from '@/modules/transform/this-month';

const ThisMonthPage: FC = () => {
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
        <CompaniesCommentsSection
          barChartSimpleData={barChartSimpleData}
          tablesData={companyTableData}
        />
      </div>
    </section>
  );
};

export default ThisMonthPage;
