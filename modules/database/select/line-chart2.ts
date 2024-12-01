import { db } from '@/modules/database/schema';
import { getFirstMonth, getLastMonth } from './month';

import { LineChartMultipleData } from '@/types/charts';

export const getNewOldCompaniesCountForAllMonths = (): LineChartMultipleData[] => {
  const firstMonth = getFirstMonth();
  const lastMonth = getLastMonth();

  const query = `
    WITH OrderedMonths AS (
      SELECT 
        name,
        LAG(name) OVER (ORDER BY name DESC) AS comparedToMonth
      FROM month
      WHERE name <= ? AND name >= ?
    ),
    CompanyCounts AS (
      SELECT 
        om.name AS forMonth,
        om.comparedToMonth,
        (
          SELECT COUNT(*) 
          FROM company c1 
          WHERE c1.monthName = om.name 
            AND c1.name NOT IN (SELECT c2.name FROM company c2 WHERE c2.monthName < om.name)
        ) AS firstTimeCompaniesCount,
        (
          SELECT COUNT(*) 
          FROM company c1 
          WHERE c1.monthName = om.name 
            AND c1.name NOT IN (SELECT c2.name FROM company c2 WHERE c2.monthName = om.comparedToMonth)
            AND c1.name IN (SELECT c3.name FROM company c3 WHERE c3.monthName < om.name)
        ) AS newCompaniesCount,
        (
          SELECT COUNT(*) 
          FROM company c1 
          WHERE c1.monthName = om.name 
            AND c1.name IN (SELECT c2.name FROM company c2 WHERE c2.monthName = om.comparedToMonth)
        ) AS oldCompaniesCount,
        (
          SELECT COUNT(*) 
          FROM company 
          WHERE monthName = om.name
        ) AS allCompaniesCount
      FROM OrderedMonths om
      WHERE om.comparedToMonth IS NOT NULL -- Ensure we ignore the oldest month without a predecessor
    )
    SELECT 
      forMonth,
      firstTimeCompaniesCount,
      newCompaniesCount,
      oldCompaniesCount,
      allCompaniesCount
    FROM CompanyCounts
    ORDER BY forMonth DESC;
  `;

  const result = db
    .prepare<[string, string], LineChartMultipleData>(query)
    .all(lastMonth.name, firstMonth.name);

  return result;
};

/*
WITH MonthPairs AS (
  SELECT 
    m1.name AS forMonth, 
    m2.name AS comparedToMonth
  FROM month m1
  JOIN month m2 ON m1.name < m2.name
  WHERE m1.name <= ? AND m1.name >= ? AND m2.name <= ? AND m2.name >= ?
),
*/

const _query = `
WITH MonthPairs AS (
  SELECT 
    m1.name AS forMonth, 
    m2.name AS comparedToMonth
  FROM month m1
  JOIN month m2 ON m1.name = (
    SELECT MAX(name)
    FROM month
    WHERE name < m2.name
  )
  WHERE m1.name <= ? AND m1.name >= ? AND m2.name <= ? AND m2.name >= ?
),
CompanyCounts AS (
  SELECT 
    mp.forMonth,
    mp.comparedToMonth,
    (
      SELECT COUNT(*) 
      FROM company c1 
      WHERE c1.monthName = mp.forMonth 
        AND c1.name NOT IN (SELECT c2.name FROM company c2 WHERE c2.monthName < mp.forMonth)
    ) AS firstTimeCompaniesCount,
    (
      SELECT COUNT(*) 
      FROM company c1 
      WHERE c1.monthName = mp.forMonth 
        AND c1.name NOT IN (SELECT c2.name FROM company c2 WHERE c2.monthName = mp.comparedToMonth)
        AND c1.name IN (SELECT c3.name FROM company c3 WHERE c3.monthName < mp.forMonth)
    ) AS newCompaniesCount,
    (
      SELECT COUNT(*) 
      FROM company c1 
      WHERE c1.monthName = mp.forMonth 
        AND c1.name IN (SELECT c2.name FROM company c2 WHERE c2.monthName = mp.comparedToMonth)
    ) AS oldCompaniesCount,
    (
      SELECT COUNT(*) 
      FROM company 
      WHERE monthName = mp.forMonth
    ) AS allCompaniesCount
  FROM MonthPairs mp
)
SELECT 
  forMonth,
  firstTimeCompaniesCount,
  newCompaniesCount,
  oldCompaniesCount,
  allCompaniesCount
FROM CompanyCounts
ORDER BY forMonth DESC
`;
