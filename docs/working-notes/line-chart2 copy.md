Can you help me speed up this SQLite query?

I have two tables: month (thread) and company (comments in thread), here is the Better-Sqlite schema:

```typescript
db.exec(`
  CREATE TABLE IF NOT EXISTS month (
    name TEXT PRIMARY KEY, -- "YYYY-MM" format for uniqueness
    threadId TEXT UNIQUE,
    createdAtOriginal DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- auto-populated
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP -- auto-populated on creation
  );

  CREATE TABLE IF NOT EXISTS company (
    name TEXT,
    monthName TEXT,
    commentId TEXT UNIQUE,
    createdAtOriginal DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (name, monthName),
    FOREIGN KEY (monthName) REFERENCES month(name)
  );
`);
```

What query should do:

It should return array of objects of this type:

```typescript
export interface LineChartMultipleData {
  monthName: string;
  firstTimeCompaniesCount: number;
  newCompaniesCount: number;
  oldCompaniesCount: number;
  allCompaniesCount: number;
}
```

For each subsequent, descending month pair (e.g. `[['2024-03', '2024-02'], ['2024-02', '2024-01'], ...]` but not non-subsequent e.g. `['2024-03', '2024-01']`) it should return one instance of `LineChartMultipleData` where `monthName` is greater (newer) month in the month pair.

`firstTimeCompaniesCount` - count of companies that are present in the current month and not present in any other older month.  
`newCompaniesCount` - count of companies that are not present in the first previous month.  
`oldCompaniesCount` - count of companies that are present in the first previous month.  
`allCompaniesCount` - count of all distinct companies by company.name column.

The first (oldest) month should not create pair because it doesn't have adjacent predecessor to create pair for comparison.

Here is Typescript function with Better-Sqlite that runs infinitely long and never returns a result, so it is either incorrect or very inefficient:

```typescript
export const getNewOldCompaniesCountForAllMonths = (): LineChartMultipleData[] => {
  const firstMonth = getFirstMonth();
  const lastMonth = getLastMonth();

  const query = `WITH OrderedMonths AS (
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
```

Another variation for month pairs that also runs infinitely without ever producing a result:

```typescript
const query = `WITH MonthPairs AS (
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
  -- ...`;
```

I also have this query for a single month that runs correctly and that I can run in Typescript and map over an array of month pairs, and like that it takes 5 seconds to execute on the set of 130 months and 60 000 companies. Which is unacceptable performance and I hoped that by performing entire execution within a single SQLite query I can speed it up and take it bellow 1 second.

But at least this runs correctly and returns valid result.

```typescript
const getNewOldCompaniesCountForTwoMonths = (monthPair: MonthPair): LineChartMultipleData => {
  const { forMonth, comparedToMonth } = monthPair;

  const firstTimeCompaniesCount =
    db
      .prepare<[string, string], CountResult>(
        `SELECT COUNT(*) as count 
         FROM company AS c1 
         WHERE c1.monthName = ? 
           AND c1.name NOT IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName < ?)`
      )
      .get(forMonth, forMonth)?.count ?? 0;

  const newCompaniesCount =
    db
      .prepare<[string, string, string], CountResult>(
        `SELECT COUNT(*) as count 
         FROM company AS c1 
         WHERE c1.monthName = ? 
           AND c1.name NOT IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName = ?) 
           AND c1.name IN (SELECT c3.name FROM company AS c3 WHERE c3.monthName < ?)`
      )
      .get(forMonth, comparedToMonth, forMonth)?.count ?? 0;

  const oldCompaniesCount =
    db
      .prepare<[string, string], CountResult>(
        `SELECT COUNT(*) as count 
         FROM company AS c1 
         WHERE c1.monthName = ? 
           AND c1.name IN (SELECT c2.name FROM company AS c2 WHERE c2.monthName = ?)`
      )
      .get(forMonth, comparedToMonth)?.count ?? 0;

  const allCompaniesCount =
    db
      .prepare<[string], CountResult>(
        `SELECT COUNT(*) as count 
         FROM company 
         WHERE monthName = ?`
      )
      .get(forMonth)?.count ?? 0;

  return {
    monthName: forMonth,
    firstTimeCompaniesCount,
    newCompaniesCount,
    oldCompaniesCount,
    allCompaniesCount,
  };
};
```

Can you help me write **a single, correct and optimized SQLite query for the entire set?**
