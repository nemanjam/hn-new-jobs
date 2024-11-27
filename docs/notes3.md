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