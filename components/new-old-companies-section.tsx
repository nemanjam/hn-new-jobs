'use client';

import { FC } from 'react';

import NewOldCompaniesCard from '@/components/new-old-companies-card';
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
      <NewOldCompaniesCard month={month} allMonths={allMonths} newOldCompanies={newOldCompanies} />
      <NewOldCompaniesList newOldCompanies={newOldCompanies} />
    </>
  );
};

export default NewOldCompaniesSection;
