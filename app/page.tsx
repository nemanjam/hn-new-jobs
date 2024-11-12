import { FC } from 'react';
import Link from 'next/link';

import { TestChart } from '@/components/charts/test-chart';

import {
  getCommentsForLastMonthCompanies,
  getMonthByName,
  getNewOldCompaniesForAllMonths,
  getNewOldCompaniesForLastTwoMonths,
} from '@/modules/database/select';
import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { CompanyComments, DbCompany, DbMonth, NewOldCompanies } from '@/types/database';

const IndexPage: FC = () => {
  const newOldCompanies = getNewOldCompaniesForLastTwoMonths();

  const allNewOldCompanies = getNewOldCompaniesForAllMonths();

  const companiesComments = getCommentsForLastMonthCompanies();

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

  const printNumbers = (newOldCompanies: NewOldCompanies) => {
    const {
      newCompanies,
      oldCompanies,
      firstTimeCompanies,
      totalCompaniesCount,
      forMonth,
      comparedToMonth,
    } = newOldCompanies;

    return (
      <p className="flex gap-4">
        <label className="font-bold">For month:</label>
        <Link href={getThreadOrCommentUrlFromId(forMonth.threadId)} target="_blank">
          {forMonth.name}
        </Link>

        <label className="font-bold">compared to month:</label>
        <Link href={getThreadOrCommentUrlFromId(comparedToMonth.threadId)} target="_blank">
          {comparedToMonth.name}
        </Link>

        <label className="font-bold">first time companies:</label>
        <span>{firstTimeCompanies.length}</span>

        <label className="font-bold">new companies:</label>
        <span>{newCompanies.length}</span>

        <label className="font-bold">old companies:</label>
        <span>{oldCompanies.length}</span>

        <label className="font-bold">total companies count:</label>
        <span>{totalCompaniesCount}</span>
      </p>
    );
  };

  const printCompaniesLocal = (label: string, companies: DbCompany[]) => {
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
        {printCompaniesComments(companiesComments)}

        {printCompanies(newOldCompanies)}

        {printAllCompanies(allNewOldCompanies)}
      </div>

      {/* content */}
      <div className="max-w-lg">
        <TestChart />
      </div>
    </section>
  );
};

export default IndexPage;
