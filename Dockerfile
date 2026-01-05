FROM node:20-alpine

WORKDIR /repo

COPY . .

RUN npm install

RUN npm run build -- --filter=web

WORKDIR /repo/apps/web

EXPOSE 8000
CMD ["npm", "start"]
