FROM node:10
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN npm install yarn --global
RUN yarn install
COPY . .
EXPOSE 3000
ENV NODE_ENV development