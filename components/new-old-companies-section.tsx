import { FC } from 'react';

import NewOldCompaniesCard from '@/components/new-old-companies-card';
import NewOldCompaniesLegend from '@/components/new-old-companies-legend';
import NewOldCompaniesList from '@/components/new-old-companies-list';

import { DbMonth, NewOldCompanies } from '@/types/database';

interface Props {
  newOldCompanies: NewOldCompanies;
  month: string;
  allMonths: DbMonth[];
}

const NewOldCompaniesSection: FC<Props> = ({ newOldCompanies, allMonths, month }) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <NewOldCompaniesCard
          month={month}
          allMonths={allMonths}
          newOldCompanies={newOldCompanies}
        />
        <NewOldCompaniesLegend />
      </div>
      <NewOldCompaniesList month={month} newOldCompanies={newOldCompanies} />
    </>
  );
};

export default NewOldCompaniesSection;
