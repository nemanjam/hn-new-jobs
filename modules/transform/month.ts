import { NewOldCompanies } from '@/types/database';

export const initialIndex = 0 as const;

export const getIndex = (allNewOldCompanies: NewOldCompanies[], monthName: string): number => {
  const index = allNewOldCompanies.findIndex(
    (newOldCompanies) => newOldCompanies.forMonth.name === monthName
  );

  return index !== -1 ? index : initialIndex;
};
