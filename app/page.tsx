import { FC } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // prerender once into variable in server code
  const getBarChartSimpleData = (companiesComments: CompanyComments[]): BarChartSimpleData => {
    const items: BarChartSimpleDataItem[] = [
      { range: '1', count: 0 },
      { range: '2-3', count: 0 },
      { range: '4-5', count: 0 },
      { range: '6-7', count: 0 },
      { range: '8-12', count: 0 },
    ];

    const getItem = (range: RangeType) =>
      items.find((item) => item.range === range) as BarChartSimpleDataItem;

    const monthName = companiesComments[0].company.monthName;

    companiesComments.forEach((companyComments) => {
      const { company, comments } = companyComments;
      const { monthName } = company;

      const _12mOldMonthName = createOldMonthName(monthName, 12);

      const commentsCount = comments.filter(
        (comment) => comment.monthName >= _12mOldMonthName
      ).length;

      switch (true) {
        case commentsCount === 1:
          getItem('1').count++;
          break;
        case commentsCount === 2 || commentsCount === 3:
          getItem('2-3').count++;
          break;
        case commentsCount === 4 || commentsCount === 5:
          getItem('4-5').count++;
          break;
        case commentsCount === 6 || commentsCount === 7:
          getItem('6-7').count++;
          break;
        case commentsCount > 7:
          getItem('8-12').count++;
          break;
      }
    });

    return { monthName, items };
  };

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

  const StatItem = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );

  function printNumbers(newOldCompanies: NewOldCompanies) {
    const {
      newCompanies,
      oldCompanies,
      firstTimeCompanies,
      totalCompaniesCount,
      forMonth,
      comparedToMonth,
    } = newOldCompanies;

    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Month Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-x-2">
              <span className="text-sm font-medium text-muted-foreground">For month</span>
              <Link
                href={forMonth.threadId}
                target="_blank"
                className="text-lg font-semibold hover:underline"
              >
                {forMonth.name}
              </Link>
            </div>
            <div className="space-x-2">
              <span className="text-sm font-medium text-muted-foreground">Compared to month</span>
              <Link
                href={comparedToMonth.threadId}
                target="_blank"
                className="text-lg font-semibold hover:underline"
              >
                {comparedToMonth.name}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatItem label="First time companies" value={firstTimeCompanies.length} />
            <StatItem label="New companies" value={newCompanies.length} />
            <StatItem label="Old companies" value={oldCompanies.length} />
            <StatItem label="Total companies" value={totalCompaniesCount} />
          </div>
        </CardContent>
      </Card>
    );
  }

  const _printNumbers = (newOldCompanies: NewOldCompanies) => {
    const {
      newCompanies,
      oldCompanies,
      firstTimeCompanies,
      totalCompaniesCount,
      forMonth,
      comparedToMonth,
    } = newOldCompanies;

    return (
      <ul className="flex flex-wrap gap-2">
        <li>
          <label className="font-bold mr-2">For month:</label>
          <Link href={getThreadOrCommentUrlFromId(forMonth.threadId)} target="_blank">
            {forMonth.name}
          </Link>
        </li>

        <li>
          <label className="font-bold mr-2">Compared to month:</label>
          <Link href={getThreadOrCommentUrlFromId(comparedToMonth.threadId)} target="_blank">
            {comparedToMonth.name}
          </Link>
        </li>

        <li>
          <label className="font-bold mr-2">First time companies:</label>
          <span>{firstTimeCompanies.length}</span>
        </li>

        <li>
          <label className="font-bold mr-2">New companies:</label>
          <span>{newCompanies.length}</span>
        </li>

        <li>
          <label className="font-bold mr-2">Old companies:</label>
          <span>{oldCompanies.length}</span>
        </li>

        <li>
          <label className="font-bold mr-2">Total companies:</label>
          <span>{totalCompaniesCount}</span>
        </li>
      </ul>
    );
  };

  const printCompaniesLocal = (label: string, companies: DbCompany[]) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="font-bold">{label}</label>
        <div className="flex flex-wrap gap-x-2">
          {companies.map((company) => {
            const { name, commentId } = company;

            return (
              <Link
                key={commentId}
                href={getThreadOrCommentUrlFromId(commentId)}
                target="_blank"
                className="whitespace-nowrap mr-2"
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const printCompanies = (newOldCompanies: NewOldCompanies) => {
    const { newCompanies, oldCompanies, firstTimeCompanies } = newOldCompanies;

    return (
      <>
        {printNumbers(newOldCompanies)}

        {printCompaniesLocal('First time companies:', firstTimeCompanies)}

        {printCompaniesLocal('New companies:', newCompanies)}

        {printCompaniesLocal('Old companies:', oldCompanies)}
      </>
    );
  };

  const printAllCompanies = (allNewOldCompanies: NewOldCompanies[]) => {
    return allNewOldCompanies.map((newOldCompanies) => {
      const { forMonth } = newOldCompanies;

      return (
        <div key={forMonth.name} className="flex flex-col gap-4">
          {printCompanies(newOldCompanies)}
        </div>
      );
    });
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
        {/* <LineChartMultiple chartData={areaChartInteractiveData} /> */}

        {/* <BarChartSimple chartData={getBarChartSimpleData(companiesComments)} /> */}

        {/* <AreaChartInteractive chartData={areaChartInteractiveData} /> */}

        {/* {printCompaniesComments(companiesComments)} */}

        {printCompanies(newOldCompanies)}

        {/* {printAllCompanies(allNewOldCompanies)} */}

        {/* <TestChart /> */}
      </div>
    </section>
  );
};

export default IndexPage;
