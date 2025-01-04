import { getDb } from '@/modules/database/schema';
import { getAllMonths } from '@/modules/database/select/month';
import { isValidMonthName } from '@/utils/validation';
import { ALGOLIA } from '@/constants/algolia';

const { threads } = ALGOLIA;
const { oldestUsefulMonth } = threads;

/**
 * Deletes all months older than (excluding) the given monthName and related companies.
 * @param monthName - The cutoff month in "YYYY-MM" format.
 */
export const deleteMonthsAndCompaniesOlderThanMonth = (
  monthName = oldestUsefulMonth as string
): number => {
  if (!isValidMonthName(monthName))
    throw new Error(`Invalid format, monthName: ${monthName}. Expected "YYYY-MM".`);

  // Delete months and cascade to related companies
  const changes = getDb().prepare(`DELETE FROM month WHERE name < ?`).run(monthName).changes;

  return changes;
};

/**
 * Newer than (excluding) monthName. Delete last month by default.
 * For debugging cache invalidation on new month.
 */
export const deleteMonthsAndCompaniesNewerThanMonth = (
  monthName = getAllMonths()[1].name
): number => {
  if (!isValidMonthName(monthName))
    throw new Error(`Invalid format, monthName: ${monthName}. Expected "YYYY-MM".`);

  const changes = getDb().prepare(`DELETE FROM month WHERE name > ?`).run(monthName).changes;

  return changes;
};
