import { FC } from 'react';

import LineChartMultiple from '@/components/charts/line-chart-multiple';
import NewOldCompaniesCard from '@/components/new-old-companies-card';
import NewOldCompaniesList from '@/components/new-old-companies-list';

import { lastMonthNewOldCompanies } from '@/modules/transform/database';
import { lineChartMultipleData } from '@/modules/transform/line-chart';

const IndexPage: FC = () => {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Hackernews new jobs
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          First time, new and old job ads for every month through the history.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <LineChartMultiple chartData={lineChartMultipleData} />
        <NewOldCompaniesCard newOldCompanies={lastMonthNewOldCompanies} />
        <NewOldCompaniesList newOldCompanies={lastMonthNewOldCompanies} />
      </div>
    </section>
  );
};

export default IndexPage;
