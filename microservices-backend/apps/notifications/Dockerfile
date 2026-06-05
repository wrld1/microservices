FROM node:24-alpine AS development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY tsconfig.json nest-cli.json ./
COPY apps/notifications/tsconfig.app.json apps/notifications/tsconfig.app.json
COPY apps/notifications/package.json apps/notifications/package.json

RUN npm ci

COPY apps/notifications apps/notifications
COPY libs libs

RUN npm run build notifications

FROM node:24-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY apps/notifications/package.json ./package.json
COPY --from=development /usr/src/app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist/apps/notifications ./dist/apps/notifications

CMD ["node", "dist/apps/notifications/main"]
