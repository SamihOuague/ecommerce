FROM node:18

RUN npm -g install npm

ADD . /app

WORKDIR /app

RUN npm install

CMD ["node", "server.js"]

EXPOSE 3000