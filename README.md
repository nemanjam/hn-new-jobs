# HackerNews new jobs

A website that provides obvious, effortless and deep insights into fresh and recurring job opportunities in Hacker News "Who's Hiring" thread.

For example, if you are looking for a job and want to focus more on fresh opportunities or research the ad history of a specific company.

## Demo

https://hackernews-new-jobs.arm1.nemanjamitic.com

## Screenshots

https://github.com/user-attachments/assets/c4acb705-e0ef-45bf-92a1-f445deabd660

## Features

- Separate companies by: 1. First time companies (first job ad ever), 2. New companies (no job ad in previous month), 3. Old companies (had job ad in previous month) for every month in history
- Display separated companies in multi-line chart graph
- Job ad posts are linked and sorted by original time of creation
- For every company in a month, find every job ad in history, link them and sort them chronologically
- Display separated companies by number of job ads in the previous 12 months period in bar chart graph
- Search job ads from a company
- Cron job for parsing a new month
- Cron job to respect Algolia API rate limiting and parse and seed database for the entire history (since `2015-06` uniform formatting with `|` separated post titles)
- SQLite database for fast querying and Keyv caching for fast reads and page load
- Http response caching with Keyv to reduce load on Algolia API and mitigate rate limiting
- Docker deployments with x86 and ARM images, from local machine and Github Actions
- Next.js app router app with SSR and Shadcn components
- Responsive design and dark theme support
- Plausible analytics
- Winston logging
- Clean, separated types, constants, utils and config

## Installation and running

```bash
node -v
# v22.9.0

# set environment variables
cp .env.example .env

# install dependencies
yarn install

# run in dev mode, visit http://localhost:3000/
yarn dev

# build
yarn build

# run in prod mode
yarn standalone

# or
yarn cp
node .next/standalone/server.js

# Docker

# build image
yarn dc:build

# run
yarn dc:up
```

## Deployment

### Environment variables

Create `.env` file.

```bash
cp .env.example .env
```

Set environment variables.

```bash
# .env

# for metadata
SITE_HOSTNAME=my-domain.com

# protect endpoints
API_SECRET=long-string

# plausible analytics
PLAUSIBLE_SERVER_URL=https://plausible.my-domain.com
PLAUSIBLE_DOMAIN=my-domain.com
```

### Github Actions

Set the following Github secrets and use `build-push-docker.yml` and `deploy-docker.yml` Github Actions workflows to build, push and deploy Docker image to the remote server.

```bash
DOCKER_USERNAME
DOCKER_PASSWORD

REMOTE_HOST
REMOTE_USERNAME
REMOTE_KEY_ED25519
REMOTE_PORT
```

Copy seeded database to the remote server.

```bash
# replace <vars>
scp ./data/database/hn-new-jobs-database-dev.sqlite3 <user@server>:~/<your-path-on-server>/hn-new-jobs/data/database/hn-new-jobs-database-prod.sqlite3

# e.g.
scp ./data/database/hn-new-jobs-database-dev.sqlite3 arm1:~/traefik-proxy/apps/hn-new-jobs/data/database/hn-new-jobs-database-prod.sqlite3
```

### Deploy from local machine

```bash
# build and push x86 and arm images
yarn docker:build:push:all

# edit package.json script, replace <vars>
"deploy:docker:pi": "bash scripts/deploy-docker.sh <user@server> '~/<your-path-on-server>/hn-new-jobs' <your-image-name:latest>"

# deploy to remote server
yarn deploy:docker:pi
```

## Implementation details

#### Database ER diagram

![Database ER diagram](docs/screenshots/hn-new-jobs-database-er-diagram.png)

## Todo

- Handle not found exceptions in database select queries
- Winston rotate single file

## References

- Shadcn starter project (updated) https://github.com/shadcn-ui/next-template
- Shadcn components docs https://ui.shadcn.com/docs/components/accordion
- Shadcn chart examples https://ui.shadcn.com/charts
- Shadcn data table docs https://ui.shadcn.com/docs/components/data-table
- Search and pagination as url query params to keep SSR for filtering Products list https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
- HN Algolia API docs https://hn.algolia.com/api
- Plausible configuration https://github.com/4lejandrito/next-plausible

## License

MIT license: [License](LICENSE)
