FROM node:20-slim
ENV NODE_ENV=production
ENV HUSKY=0

WORKDIR /app

COPY package.json yarn.lock ./
COPY api/package.json ./api/

RUN yarn install --frozen-lockfile --production

COPY api ./api

WORKDIR /app/api
EXPOSE 3000
CMD ["yarn", "start"]