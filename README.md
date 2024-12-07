# HackerNews new jobs

A website that provides obvious, effortless and deep insights into fresh and recurring job opportunities in Hacker News "Who's Hiring" thread.

For example, if you are looking for a job and want to put more focus on fresh opportunities or research specific company's ad history.

## Demo

https://hackernews-new-jobs.arm1.nemanjamitic.com

## Screenshots

https://github.com/user-attachments/assets/c4acb705-e0ef-45bf-92a1-f445deabd660

## Features

## Installation and running

```bash
node -v
# v22.9.0

# install dependencies
yarn install

# run in dev mode, visit http://localhost:3000/
yarn dev

# build
yarn build

# run in prod mode
yarn standalone

# or
node .next/standalone/server.js
yarn cp

# Docker

# build image
yarn dc:build

# run
yarn dc:up
```

## Deployment

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

### Local

```bash
# build and push x86 and arm images
yarn docker:build:push:all

# edit package.json script, replace <vars>
"deploy:docker:pi": "bash scripts/deploy-docker.sh <user@server> '~/<your-path-on-server>/hn-new-jobs' <your-image-name:latest>"


# deploy to remote server
yarn deploy:docker:pi
```

## Implementation details

## References

## License

This project uses MIT license: [License](LICENSE)
