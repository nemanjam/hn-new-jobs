import { db } from '@/modules/database/schema';

import { LineChartMultipleData } from '@/types/charts';

export const getNewOldCompaniesCountForAllMonths = (): LineChartMultipleData[] => {
  const query = `
    WITH OrderedMonths AS (
        SELECT 
            name AS currentMonth,
            LAG(name) OVER (ORDER BY name ASC) AS previousMonth
        FROM month
    ),
    FirstTimeCompanies AS (
        SELECT 
            c1.monthName AS monthName,
            COUNT(DISTINCT c1.name) AS firstTimeCompaniesCount
        FROM company c1
        WHERE NOT EXISTS (
            SELECT 1 
            FROM company c2 
            WHERE c1.name = c2.name AND c2.monthName < c1.monthName
        )
        GROUP BY c1.monthName
    ),
    NewCompanies AS (
        SELECT 
            c1.monthName AS monthName,
            COUNT(DISTINCT c1.name) AS newCompaniesCount
        FROM company c1
        JOIN OrderedMonths om ON c1.monthName = om.currentMonth
        WHERE NOT EXISTS (
            SELECT 1 
            FROM company c2 
            WHERE c1.name = c2.name AND c2.monthName = om.previousMonth
        )
        AND EXISTS (
            SELECT 1
            FROM company c3
            WHERE c1.name = c3.name AND c3.monthName < c1.monthName
        )
        GROUP BY c1.monthName
    ),
    OldCompanies AS (
        SELECT 
            c1.monthName AS monthName,
            COUNT(DISTINCT c1.name) AS oldCompaniesCount
        FROM company c1
        JOIN OrderedMonths om ON c1.monthName = om.currentMonth
        WHERE EXISTS (
            SELECT 1 
            FROM company c2 
            WHERE c1.name = c2.name AND c2.monthName = om.previousMonth
        )
        GROUP BY c1.monthName
    ),
    AllCompanies AS (
        SELECT 
            c1.monthName AS monthName,
            COUNT(DISTINCT c1.name) AS allCompaniesCount
        FROM company c1
        GROUP BY c1.monthName
    )
    SELECT 
        om.currentMonth AS monthName,
        ftc.firstTimeCompaniesCount,
        COALESCE(nc.newCompaniesCount, 0) AS newCompaniesCount,
        COALESCE(oc.oldCompaniesCount, 0) AS oldCompaniesCount,
        ac.allCompaniesCount
    FROM OrderedMonths om
    LEFT JOIN FirstTimeCompanies ftc ON om.currentMonth = ftc.monthName
    LEFT JOIN NewCompanies nc ON om.currentMonth = nc.monthName
    LEFT JOIN OldCompanies oc ON om.currentMonth = oc.monthName
    LEFT JOIN AllCompanies ac ON om.currentMonth = ac.monthName
    ORDER BY om.currentMonth ASC;  -- affects only final order, reverse on server, right in db for graph to consume 
`;

  const result = db.prepare<[], LineChartMultipleData>(query).all();

  return result;
};
