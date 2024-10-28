import { promises as fs } from 'fs';
import { join } from 'path';

import type { FormattedResult, Input } from '@/types/parser';

export const formatResult = (input: Input): FormattedResult => {
  const { result, month1, month2 } = input;
  const { newCompanies, oldCompanies } = result;

  const totalCount = newCompanies.length + oldCompanies.length;
  const newCount = newCompanies.length;
  const oldCount = oldCompanies.length;
  const percentageOfNew = `${Math.round((newCount / totalCount) * 100)}%`;
  const percentageOfOld = `${Math.round((oldCount / totalCount) * 100)}%`;
  const newNames = newCompanies.map((company) => company.name);
  const oldNames = oldCompanies.map((company) => company.name);

  const output: FormattedResult = {
    forMonth: month2,
    comparedToMonth: month1,
    totalCount,
    newCount,
    oldCount,
    percentageOfNew,
    percentageOfOld,
    newNames,
    oldNames,
    newCompanies,
    oldCompanies,
  };

  return output;
};

export const saveAsJsonFile = async (
  data: unknown,
  fileName: string
): Promise<void> => {
  const jsonString = JSON.stringify(data, null, 2);

  const filePath = join(__dirname, fileName);

  try {
    await fs.writeFile(filePath, jsonString, 'utf8');
    console.log(`File saved as ${filePath}`);
  } catch (error) {
    console.error('Error writing file', error);
  }
};
