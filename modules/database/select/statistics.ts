import { db } from '@/modules/database/schema';

import { Statistics } from '@/types/database';

export const getStatistics = (): Statistics | undefined => {
  const statistics = db
    .prepare<[], Statistics>(
      `SELECT
         (SELECT COUNT(DISTINCT name) FROM month) AS monthsCount,
         (SELECT COUNT(DISTINCT commentId) FROM company) AS commentsCount,
         (SELECT COUNT(DISTINCT name) FROM company) AS companiesCount`
    )
    .get();

  return statistics;
};
