FROM --platform=linux/amd64 node:19-slim

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
