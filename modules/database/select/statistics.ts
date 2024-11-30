import { db } from '@/modules/database/schema';
import { getFirstMonth, getLastMonth } from '@/modules/database/select/month';

import { Statistics } from '@/types/database';

export const getStatistics = (): Statistics | undefined => {
  const counts = db
    .prepare<[], Statistics>(
      `SELECT
         (SELECT COUNT(DISTINCT name) FROM month) AS monthsCount,
         (SELECT COUNT(DISTINCT commentId) FROM company) AS commentsCount,
         (SELECT COUNT(DISTINCT name) FROM company) AS companiesCount`
    )
    .get()!;

  const firstMonth = getFirstMonth();
  const lastMonth = getLastMonth();

  const statistics = {
    ...counts,
    firstMonth,
    lastMonth,
  };

  return statistics;
};
