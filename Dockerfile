FROM alpine:3.10.2

WORKDIR /app

RUN apk add --update --no-cache nodejs=~10.16 npm=~10.16

COPY . /app/
RUN npm install

RUN npm run build

CMD ["npm", "run", "serve"]
