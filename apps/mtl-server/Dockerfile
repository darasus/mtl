FROM node:14-alpine as build-dependencies

WORKDIR /build-dependencies

COPY package.json .
COPY yarn.lock .
COPY apps/mtl-app/prisma/schema.prisma ./apps/mtl-app/prisma/schema.prisma

RUN yarn install

FROM node:14-alpine as runtime-dependencies

WORKDIR /runtime-dependencies

COPY package.json .
COPY yarn.lock .
COPY apps/mtl-app/prisma/schema.prisma ./apps/mtl-app/prisma/schema.prisma

RUN yarn install --production

FROM node:14-alpine as builder

WORKDIR /build

COPY apps/mtl-app/project.json ./apps/mtl-app/project.json
COPY apps/mtl-app-e2e/project.json ./apps/mtl-app-e2e/project.json
COPY apps/mtl-screenshot-api/project.json ./apps/mtl-screenshot-api/project.json
COPY apps/mtl-server ./apps/mtl-server
COPY libs/types ./libs/types
COPY libs/api-types ./libs/api-types
COPY workspace.json ./workspace.json
COPY nx.json ./nx.json
COPY package.json ./package.json
COPY .eslintrc.json ./.eslintrc.json
COPY babel.config.json ./babel.config.json
COPY tsconfig.base.json ./tsconfig.base.json

COPY --from=build-dependencies /build-dependencies/node_modules ./node_modules

ENV NODE_ENV production

RUN yarn nx build mtl-server --prod

FROM node:14-alpine as runtime

COPY --from=runtime-dependencies /runtime-dependencies/node_modules ./node_modules
COPY --from=builder /build/dist ./dist

CMD ["node", "dist/apps/mtl-server/main.js"]