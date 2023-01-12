FROM --platform=linux/amd64 node:19-slim

WORKDIR /usr/src/client

COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

COPY . .

CMD [ "node", "index.js" ]
