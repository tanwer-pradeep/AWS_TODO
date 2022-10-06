FROM node:12
WORKDIR /app

ENV NODE_ENV production

COPY pakage*.json ./

RUN rm -rf node_modules
RUN rm -f package-lock.json
RUN npm cache clean --force

RUN npm install

COPY . .

RUN npm install -g pm2
RUN npm install express --save

EXPOSE 3000

CMD ["pm2-runtime", "index.js"]