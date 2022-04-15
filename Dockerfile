FROM node:16-alpine

# Set working directory to /cmwa
WORKDIR /cmwa

# Copy app source
COPY . .

# Install client dependencies
WORKDIR /cmwa/client
RUN npm i
RUN npm i -g serve
RUN npm run build

# Install server dependencies
WORKDIR /cmwa/server
RUN npm i

WORKDIR /cmwa
EXPOSE 3000
CMD sh launch.sh