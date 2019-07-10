# Create a client build
FROM node:8-alpine as builder
WORKDIR /usr/app
COPY ./src/client/package.json .
RUN yarn --production
COPY ./src/client .
RUN yarn build

# Final build with client
FROM node:8-alpine
WORKDIR /usr/app
COPY ./package.json .
RUN yarn --production
COPY . .
# Remove the client directory that gets copied over since it gets replaced with the built client
RUN rm -rf src/client
COPY --from=builder /usr/app/build src/client
# Start the server
ENTRYPOINT ["yarn", "start"]