'use client';

import { FC, useState } from 'react';

import NewOldCompaniesCard, { initialIndex } from '@/components/new-old-companies-card';
import NewOldCompaniesList from '@/components/new-old-companies-list';

import { NewOldCompanies } from '@/types/database';

interface Props {
  allNewOldCompanies: NewOldCompanies[];
}

const NewOldCompaniesSection: FC<Props> = ({ allNewOldCompanies }) => {
  const [index, setIndex] = useState<number>(initialIndex);

  return (
    <>
      <NewOldCompaniesCard setIndex={setIndex} allNewOldCompanies={allNewOldCompanies} />
      <NewOldCompaniesList newOldCompanies={allNewOldCompanies[index]} />
    </>
  );
};

export default NewOldCompaniesSection;
