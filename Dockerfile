FROM node:10
WORKDIR /usr/app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3000
ENV NODE_ENV development
CMD ["yarn","npm","start","dev","yarn"]