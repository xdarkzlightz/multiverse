# Create a client build
FROM node:8-alpine as builder
WORKDIR /usr/app
COPY ./packages/client/package.json .
RUN yarn --production
COPY ./packages/client .
RUN yarn build

# Final build with client
FROM node:8-alpine
WORKDIR /usr/app
COPY ./packages/server/package.json .
RUN yarn --production
COPY ./packages/server .
COPY --from=builder /usr/app/build src/client
# Start the server
ENTRYPOINT ["yarn", "start"]