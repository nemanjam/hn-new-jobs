FROM node:22.9.0-alpine AS base


# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
# important, must use --production=false to include typescript from devDependencies for path aliases
RUN yarn install --production=false --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG ARG_SITE_HOSTNAME
ENV SITE_HOSTNAME=$ARG_SITE_HOSTNAME
RUN echo "SITE_HOSTNAME=$SITE_HOSTNAME"

ARG ARG_PLAUSIBLE_SERVER_URL
ENV PLAUSIBLE_SERVER_URL=$ARG_PLAUSIBLE_SERVER_URL
RUN echo "PLAUSIBLE_SERVER_URL=$PLAUSIBLE_SERVER_URL"

# no need for database connection at build time with getDb() that removes db from global scope
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# nextjs user can write to node users files, cache, database.sqlite
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir -p .next /app/data
RUN chown nextjs:nodejs .next /app/data

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# only folder structure
COPY --from=builder --chown=nextjs:nodejs /app/data /app/data

USER nextjs

EXPOSE 3007
ENV PORT=3007

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
