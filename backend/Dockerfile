FROM node

RUN npm install -g nodemon

WORKDIR /app

COPY . .

RUN npm install

CMD [ "nodemon", "index.js" ]