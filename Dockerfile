FROM alpine:3.10.2

WORKDIR /app

RUN apk add --update --no-cache nodejs npm

COPY . /app/
RUN npm install

RUN npm run build

CMD ["npm", "run", "serve"]
