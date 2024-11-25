import { FC } from 'react';

import LineChartMultiple from '@/components/charts/line-chart-multiple';
import NewOldCompaniesSection from '@/components/new-old-companies-section';

import { allNewOldCompanies, statistics } from '@/modules/transform/database';
import { lineChartMultipleData } from '@/modules/transform/line-chart';

const IndexPage: FC = () => {
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
        <LineChartMultiple chartData={lineChartMultipleData} />
        <NewOldCompaniesSection allNewOldCompanies={allNewOldCompanies} />
      </div>
    </section>
  );
};

export default IndexPage;
