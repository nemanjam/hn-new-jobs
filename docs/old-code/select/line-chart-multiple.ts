import { LineChartMultipleData } from '@/components/charts/line-chart-multiple';

import { db } from '@/modules/database/schema';

export const getLineChartMultipleData = (): LineChartMultipleData[] => {
  const query = `
    SELECT 
        m.name AS monthName,
        COUNT(DISTINCT CASE 
            WHEN c.name NOT IN (
                SELECT name 
                FROM company AS c2 
                WHERE c2.monthName < m.name
            ) 
            THEN c.name 
            END
        ) AS firstTimeCompaniesCount,
        COUNT(DISTINCT CASE 
            WHEN c.name NOT IN (
                SELECT name 
                FROM company AS c2 
                WHERE c2.monthName = m.name
            )
            AND c.name IN (
                SELECT name 
                FROM company AS c3 
                WHERE c3.monthName < m.name
            ) 
            THEN c.name 
            END
        ) AS newCompaniesCount,
        COUNT(DISTINCT CASE 
            WHEN c.name IN (
                SELECT name 
                FROM company AS c4 
                WHERE c4.monthName = m.name
            ) 
            AND c.name IN (
                SELECT name 
                FROM company AS c5 
                WHERE c5.monthName < m.name
            ) 
            THEN c.name 
            END
        ) AS oldCompaniesCount,
        COUNT(DISTINCT c.name) AS totalCompaniesCount
    FROM 
        month AS m
    LEFT JOIN 
        company AS c ON c.monthName = m.name
    GROUP BY 
        m.name
    ORDER BY 
        m.name DESC;
    `;

  const lineChartMultipleData = db.prepare<[], LineChartMultipleData>(query).all();

  return lineChartMultipleData;
};
