```tsx
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
winston, only console logger for prod
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
        trim first month for exception for previous month // done in database
        before '2015-07' didnt use | separators for regex
        cache line-chart result
        add caching for db
        oldestMonthLimit constant
        fix parse new month cron, on conflict upsert

        sqlite db volume is updating, next.js ssg was caching for cached db calls // eto
        in app/layout.tsx
        export const dynamic = 'force-dynamic';

extract cache wrapper from fetch-api
zod env vars

        link to latest post, sort by new comment
        only newOldCompanies.allCompanies is sorted...
        FROM SelectedCompanies sc 
        INNER JOIN DistinctComments dc
        ON sc.name = dc.name -- restore original SelectedCompanies instance for month

        database, cache, axios singletons, remove db connection from dockerfile
        plausible partytown, not available
        backup database
        line chart colors
        charts on mobile, paddings
        close navbar on resize, add hook
        1 seconds after previous 
        responsive table
        winston console prod
add info logs
        responsive superscript title text
        responsive footer
        layout min-width 320 scroll
        orange old companies
        metadata and og image
        fix scheduler logging
        add createdAtOriginal in links
        add logs in api
// plausible backup
<script defer data-domain="hackernews-new-jobs.arm1.nemanjamitic.com" src="https://plausible.arm1.nemanjamitic.com/js/script.js" />
http://localhost:3000/js/script.local.js
customDomain provider je za bez proxy, next.config.js je za sa proxy, oba mora, ok
za next.config.js mora at BUILD time, u github action
MUST PASS as build-args in Dockerfile // izgubio 2 sata

// api, reproduce and fix
 ⨯ TypeError: Cannot read properties of undefined (reading 'name')
    at s (/app/.next/server/app/api/parser/[script]/route.js:33:395)
    at r (/app/.next/server/app/api/parser/[script]/route.js:33:421)
    at p (/app/.next/server/chunks/370.js:37:279)
    at m (/app/.next/server/app/api/parser/[script]/route.js:3:28310)
    at async m (/app/.next/server/app/[[...month]]/page.js:1:53823) {
  digest: '2072576582'

}
// pi, github actions too
time="2024-12-06T14:13:15Z" level=warning msg="The \"MY_UID\" variable is not set. Defaulting to a blank string."
time="2024-12-06T14:13:15Z" level=warning msg="The \"MY_GID\" variable is not set. Defaulting to a blank string."

export MY_UID=\$(id -u) MY_GID=\$(id -g) && \
echo 'MY_UID: '\$MY_UID' and MY_GID: '\$MY_GID && \
-----
fix ! | undefined in database, handle exceptions in calls
border on search table
important: cache, db, log files in data must be created by app non-root user so app can write to them, or exceptions
-----------
docker delete old image after sure new is available
        recheck text content on website and metadata
clear cache files content, or use memory, ram usage for db?
        reduce table first column width


