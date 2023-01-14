FROM node:18

RUN npm -g install npm@latest

ADD . /app

WORKDIR /app

RUN npm install

CMD ["npm", "run", "start"]

EXPOSE 3003