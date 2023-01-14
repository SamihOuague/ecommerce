FROM node:18

RUN apt-get update && \
    npm install -g npm

ADD . /app

WORKDIR /app

RUN npm install

CMD ["npm", "start"]

EXPOSE 3005