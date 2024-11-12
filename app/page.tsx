import { FC } from 'react';
import Link from 'next/link';

import { TestChart } from '@/components/charts/test-chart';

import {
  getCommentsForLastMonthCompanies,
  getNewOldCompaniesForLastTwoMonths,
} from '@/modules/database/select';
import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { DbCompany } from '@/types/database';

const IndexPage: FC = () => {
  const newOldCompanies = getNewOldCompaniesForLastTwoMonths();
  const {
    forMonth,
    comparedToMonth,
    newCompanies,
    oldCompanies,
    firstTimeCompanies,
    totalCompaniesCount,
  } = newOldCompanies;

  const companiesComments = getCommentsForLastMonthCompanies();

  const printCompaniesComments = () => {
    const { name, threadId } = forMonth;

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

  const printNumbers = () => {
    return (
      <p>
        For month:
        <Link href={getThreadOrCommentUrlFromId(forMonth.threadId)} target="_blank">
          {forMonth.name}
        </Link>
        , compared to month:
        <Link href={getThreadOrCommentUrlFromId(comparedToMonth.threadId)} target="_blank">
          {comparedToMonth.name}
        </Link>
        , first time companies:
        {firstTimeCompanies.length}, new companies: {newCompanies.length}, old companies:
        {oldCompanies.length}, total companies count: {totalCompaniesCount}
      </p>
    );
  };

  const printCompanies = (label: string, companies: DbCompany[]) => {
    return (
      <div>
        <label className="font-bold">{label}</label>

        {companies.map((company) => {
          const { name, commentId } = company;

          return (
            <Link
              key={commentId}
              href={getThreadOrCommentUrlFromId(commentId)}
              target="_blank"
              className="mr-2"
            >
              {name}
            </Link>
          );
        })}
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
        {printCompaniesComments()}

        {printNumbers()}

        {printCompanies('First time companies:', firstTimeCompanies)}

        {printCompanies('New companies:', newCompanies)}

        {printCompanies('Old companies:', oldCompanies)}
      </div>

      {/* content */}
      <div className="max-w-lg">
        <TestChart />
      </div>
    </section>
  );
};

export default IndexPage;
