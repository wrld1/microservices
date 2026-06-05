FROM node:24-alpine As development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY tsconfig.json nest-cli.json ./
COPY apps/notifications/tsconfig.app.json apps/notifications/tsconfig.app.json
COPY apps/notifications/package.json apps/notifications/package.json

RUN npm ci

COPY apps/notifications apps/notifications
COPY libs libs

RUN npm run build notifications

FROM node:24-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY apps/notifications/package.json ./package.json
RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/notifications/main"]
