```ts
getNewOldCompaniesForLastTwoMonths // new, old, first
getNewOldCompaniesForFromToSubsequentMonths // handle last month index
getCommentsForLastMonthCompanies
---
graph old, new, first

queries sorting

color themes, hacker green, hackernews orange, dark
parser config, sever client config
single .env file
handle undefined in database
divide select for latest month and all months
iframe or csr comment expand
links color
metadata seo, plausible partytown script
        add y axis
        x and y units constants
        showing n last months text at bottom
responsive legend
react table
navbar items, pages
        fix 2 months step parse history // works fine
        histogram last month, companies with 0, 1, n posts before
tables
        card for For month:2024-11 compared to month:2024-10 first time companies:93 new companies:185 old companies:103 total companies count:288
v0 for design, companies list
shadcn dashboard for design

return_ all comments for each company, adjust query, independent on month, search table?
but histogram per month, search company db api endpoint
        active navitem
        add month selectbox and count for each company on homepage
log first and last db months on app start
on ui print how many unique companies, ads, months
single .env file
single config in root

error, code: ECONNABORTED on 20 calls
comment table, company.name pk

        select control with months for new old companies list
        fix default sort and sort
        remove first time companies from new
rename graphs and transform files
responsive styles
metadata, og image, plausible, github action
seed all months
single .env
        originalIndex prop for order
        pass sort arg for pages
AND in sql, js filter?
        add numbers of months parsed in log
        // todo: use parseMessage, winston will include message in string message
        message: string;
        add footer
think new name
winston logger files
        table pagination and initial sort
        tabela ima sort, samo initial column, nema potrebe za 2 db sort
        select control with months for histogram and table // ovo sad
clean up layout divs
        move select from table to histogram
        stats db queries, number of companies and ads
responsive table
        search company page
        responsive navbar, not perfect
split to client, server config
add favicon
fix responsive table, its just his html table without dependencies, both table and datatable
        static pages load 30mb - Single item size exceeds maxSize, api endpoints, react query
        prefer ssr for pages, call api in page
        isr static pages for every month with dynamic param // ssr enough
        all pages with params, like search // to
----
        responsive table
plausible
og image, meta, favicon
seed database for entire history
setup and test cron
winston
theme second click
body responsive font size
        fix active nav item for home page slug
------
responsive bar chart flex
        remove container and set padding, layout
legend beside barchart
        search database count query
table column width
        search isnt sorted by comments count
        first month, last month statistics
fix ! | undefined in database
        trim first month for exception for previous month // done in database
        before '2015-07' didnt use | separators for regex
cache line-chart result
add caching for db
        oldestMonthLimit constant

fix parse new month cron

151361Z INFO 02 Dec 2024 09:00:06 - axiosRateLimitInstance call, Mon Dec 02 2024 09:00:06 GMT+0000 (Coordinated Universal Time), 2 seconds after previous

2024-12-02T08:00:09.298939752Z ERROR 02 Dec 2024 09:00:09 - Parsing new month failed. UNIQUE constraint failed: company.commentId

2024-12-02T08:00:09.298983913Z LOG_CONTEXT: {

2024-12-02T08:00:09.298989273Z   "code": "SQLITE_CONSTRAINT_UNIQUE",

2024-12-02T08:00:09.298997913Z   "stack": "SqliteError: UNIQUE constraint failed: company.commentId\n    at /app/.next/server/chunks/549.js:12:219\n    at sqliteTransaction (/app/node_modules/better-sqlite3/lib/methods/transaction.js:65:24)\n    at a (/app/.next/server/chunks/549.js:12:299)\n    at p (/app/.next/server/chunks/549.js:31:4099)\n    at async u (/app/.next/server/chunks/549.js:31:4181)\n    at async l (/app/.next/server/chunks/549.js:31:2869)\n    at async s.schedule.name [as _execution] (/app/.next/server/chunks/549.js:31:5063)"

2024-12-02T08:00:09.299005033Z }
