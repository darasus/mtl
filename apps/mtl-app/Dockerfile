FROM node:14-alpine AS builder-dependencies

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY libs/prisma/src/lib/schema.prisma ./libs/prisma/src/lib/schema.prisma

RUN yarn install

FROM node:14-alpine as builder

WORKDIR /app

COPY apps/mtl-app ./apps/mtl-app
COPY apps/mtl-app-e2e/project.json ./apps/mtl-app-e2e/project.json
COPY apps/mtl-screenshot-api/project.json ./apps/mtl-screenshot-api/project.json
COPY apps/mtl-server/project.json ./apps/mtl-server/project.json
COPY libs/types ./libs/types
COPY libs/api-types ./libs/api-types
COPY libs/api-utils ./libs/api-utils
COPY workspace.json .
COPY nx.json .
COPY package.json .
COPY yarn.lock .
COPY .eslintrc.json .
COPY babel.config.json .
COPY tsconfig.base.json .
COPY --from=builder-dependencies /app/node_modules ./node_modules

ENV NODE_ENV production

RUN yarn nx build mtl-app --prod

FROM node:14-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/dist/apps/mtl-app/next.config.js ./
COPY --from=builder /app/dist/apps/mtl-app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/mtl-app/.next ./.next
COPY --from=builder-dependencies /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["./node_modules/.bin/next", "start"]