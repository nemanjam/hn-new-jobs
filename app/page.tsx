import { FC } from 'react';
import Link from 'next/link';

import AreaChartInteractive, {
  AreaChartInteractiveData,
} from '@/components/charts/area-chart-interactive';
import BarChartSimple, {
  BarChartSimpleData,
  BarChartSimpleDataItem,
  RangeType,
} from '@/components/charts/bar-chart-simple';
import LineChartMultiple from '@/components/charts/line-chart-multiple';
import NewOldCompaniesList from '@/components/new-old-companies-list';

import { getCommentsForLastMonthCompanies, getMonthByName } from '@/modules/database/select';
import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { CompanyComments, DbCompany, NewOldCompanies } from '@/types/database';

const IndexPage: FC = () => {
  const companiesComments = getCommentsForLastMonthCompanies();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Hackernews new jobs
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Deserunt cillum et veniam ullamco nostrud tempor officia irure tempor et irure nulla nulla
          irure.
        </p>
      </div>
      {/* companies lists */}
      <div className="flex flex-col gap-4">
        {/* <LineChartMultiple chartData={areaChartInteractiveData} /> */}

        {printCompaniesComments(companiesComments)}
      </div>
    </section>
  );
};

export default IndexPage;
