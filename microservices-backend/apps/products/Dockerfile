FROM node:24-alpine As development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY tsconfig.json nest-cli.json ./
COPY apps/products/tsconfig.app.json apps/products/tsconfig.app.json
COPY apps/products/package.json apps/products/package.json

RUN npm ci

COPY apps/products apps/products
COPY libs libs

RUN npx prisma generate --schema=./apps/products/prisma/schema.prisma
RUN npm run build products

FROM node:24-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY apps/products/package.json ./package.json
RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/apps/products/prisma.config.ts ./apps/products/prisma.config.ts
COPY --from=development /usr/src/app/apps/products/prisma ./apps/products/prisma

CMD ["node", "dist/apps/products/main"]
