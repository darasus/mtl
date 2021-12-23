# Install dependencies only when needed
FROM node:14-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY apps/mtl-app/prisma/schema.prisma ./apps/mtl-app/prisma/schema.prisma

RUN yarn install

# Rebuild the source code only when needed

FROM timbru31/node-alpine-git:14 as builder

WORKDIR /app

COPY apps/mtl-app ./apps/mtl-app
COPY apps/mtl-app-e2e/project.json ./apps/mtl-app-e2e/project.json
COPY apps/mtl-screenshot-api/project.json ./apps/mtl-screenshot-api/project.json
COPY apps/mtl-server/project.json ./apps/mtl-server/project.json
COPY libs/types ./libs/types
COPY libs/api-types ./libs/api-types
COPY workspace.json .
COPY nx.json .
COPY package.json .
COPY yarn.lock .
COPY .eslintrc.json .
COPY babel.config.json .
COPY tsconfig.base.json .

COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV production

RUN yarn nx build mtl-app --prod

# Production image, copy all the files and run next
FROM node:14-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/dist/apps/mtl-app/next.config.js ./
COPY --from=builder /app/dist/apps/mtl-app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/mtl-app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["./node_modules/.bin/next", "start"]