FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
COPY client/package.json ./client/
RUN yarn install --frozen-lockfile --production=false
COPY client ./client
WORKDIR /app/client
RUN yarn build

FROM nginx:alpine-slim
COPY --from=builder /app/client/dist /usr/share/nginx/html
RUN mkdir -p /etc/nginx/ssl
COPY --from=builder /app/client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]