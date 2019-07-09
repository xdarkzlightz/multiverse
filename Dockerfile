FROM node:8

# Set the working directory
WORKDIR /usr/app

# Copy the package.json for the server and client
COPY ./package.json .
COPY ./src/client/package.json src/client

# Install the servers and clients dependencies
RUN yarn --production
RUN yarn --cwd "src/client" --production

# Copy the rest of the project
COPY . .

# Create a production build of the client
RUN yarn --cwd "src/client" build

# Start the server
ENTRYPOINT ["yarn", "start"]