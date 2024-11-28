import { NewOldCompanies } from '@/types/database';

export const initialIndex = 0 as const;

export const __getNewOldCompaniesForMonth = (
  allNewOldCompanies: NewOldCompanies[],
  monthName: string
): NewOldCompanies => {
  const newOldCompanies = allNewOldCompanies.find(
    (newOldCompanies) => newOldCompanies.forMonth.name === monthName
  );

  return newOldCompanies ? newOldCompanies : allNewOldCompanies[initialIndex];
};
