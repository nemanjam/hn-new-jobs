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
import { TestChart } from '@/components/charts/test-chart';
import NewOldCompaniesList from '@/components/new-old-companies-list';

import {
  getCommentsForLastMonthCompanies,
  getMonthByName,
  getNewOldCompaniesForAllMonths,
  getNewOldCompaniesForLastTwoMonths,
} from '@/modules/database/select';
import { createOldMonthName } from '@/libs/datetime';
import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { CompanyComments, DbCompany, NewOldCompanies } from '@/types/database';

const IndexPage: FC = () => {
  const newOldCompanies = getNewOldCompaniesForLastTwoMonths();

  const allNewOldCompanies = getNewOldCompaniesForAllMonths();

  const companiesComments = getCommentsForLastMonthCompanies();

  const areaChartInteractiveData: AreaChartInteractiveData[] = allNewOldCompanies
    .map((month) => {
      const { forMonth, firstTimeCompanies, newCompanies, oldCompanies, totalCompaniesCount } =
        month;

      return {
        monthName: forMonth.name,
        firstTimeCompaniesCount: firstTimeCompanies.length,
        newCompaniesCount: newCompanies.length,
        oldCompaniesCount: oldCompanies.length,
        totalCompaniesCount: totalCompaniesCount,
      };
    })
    .reverse();

  const printCompaniesComments = (companiesComments: CompanyComments[]) => {
    const { monthName } = companiesComments[0].company;
    const month = getMonthByName(monthName);
    const { name, threadId } = month!;

    return (
      <div>
        <p>
          Comments for companies from month:
          <Link href={getThreadOrCommentUrlFromId(threadId)} target="_blank">
            {name}
          </Link>
        </p>

        <table>
          <tbody>
            {companiesComments.map((companyComments) => {
              const { company, comments, commentsCount } = companyComments;
              const { name, commentId } = company;

              // its for current month
              if (commentsCount < 2) return null;

              return (
                <tr key={name}>
                  <td>
                    <Link
                      key={commentId}
                      href={getThreadOrCommentUrlFromId(commentId)}
                      target="_blank"
                    >
                      {name}
                    </Link>
                  </td>

                  <td className="px-8">{commentsCount}</td>

                  <td className="flex flex-wrap">
                    {comments.map((comment) => {
                      const { monthName, commentId } = comment;

                      return (
                        <Link
                          key={commentId}
                          href={getThreadOrCommentUrlFromId(commentId)}
                          target="_blank"
                          className="mr-2"
                        >
                          {monthName}
                        </Link>
                      );
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

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
        <NewOldCompaniesList newOldCompanies={newOldCompanies} />

        {/* <LineChartMultiple chartData={areaChartInteractiveData} /> */}

        {/* <BarChartSimple chartData={getBarChartSimpleData(companiesComments)} /> */}

        {/* {printCompaniesComments(companiesComments)} */}
      </div>
    </section>
  );
};

export default IndexPage;
