FROM node:20-alpine

WORKDIR /app

COPY . .

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive

RUN yarn build

EXPOSE 4001

CMD ["yarn", "start"]