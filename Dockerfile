FROM --platform=linux/amd64 node:alpine

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build
ENV NODE_ENV=prod

CMD ["npm", "run", "start"]