

`
WITH LastMonthCompanies AS (
    SELECT *
    FROM company
    WHERE monthName = ?  -- Reference month for companies
    GROUP BY name
),
FilteredComments AS (
    SELECT 
        c.name,
        c.commentId,
        c.monthName,
        c.createdAt,
        c.updatedAt
    FROM company c
    WHERE c.monthName >= ?  -- Filter comments newer than this month
)
SELECT 
    lmc.name,
    lmc.commentId,
    lmc.monthName,
    lmc.createdAt,
    lmc.updatedAt,
    json_group_array(
        json_object(
            'name', fc.name,
            'monthName', fc.monthName,
            'commentId', fc.commentId,
            'createdAt', fc.createdAt,
            'updatedAt', fc.updatedAt
        )
        ORDER BY fc.monthName DESC
    ) as comments,
    COUNT(fc.commentId) as commentsCount
FROM LastMonthCompanies lmc
LEFT JOIN FilteredComments fc ON fc.name = lmc.name
GROUP BY lmc.name
ORDER BY commentsCount DESC
`