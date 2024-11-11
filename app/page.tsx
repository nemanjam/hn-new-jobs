import { FC } from 'react';

import { TestChart } from '@/components/charts/test-chart';

import { getNewOldCompaniesForLastTwoMonths } from '@/modules/parser/database';

import { DbCompany } from '@/types/database';

const IndexPage: FC = () => {
  const newOldCompanies = getNewOldCompaniesForLastTwoMonths();
  const { forMonth, comparedToMonth, newCompanies, oldCompanies, firstTimeCompanies } =
    newOldCompanies;

  const printCompanies = (label: string, companies: DbCompany[]) => {
    return (
      <div className="max-w-xl">
        <label className="font-bold">{label}</label>

        <table>
          <tbody>
            {companies.map((company) => {
              const { name, commentId } = company;

              return (
                <tr key={commentId}>
                  <td>
                    <label className="font-bold mr-2">Name:</label>
                  </td>
                  <td>{name}</td>
                  <td>
                    <label className="font-bold mr-2">Comment:</label>
                  </td>
                  <td>{commentId}</td>
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
      <div className="flex flex-col items-center gap-4">
        <label className="block font-bold">
          For month: {forMonth}, compared to month: {comparedToMonth}
        </label>

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
