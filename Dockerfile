FROM node:16-slim AS builder

ENV TERM="xterm" \
    TZ="Asia/Seoul" \
    LANG="ko_KR.UTF-8" \
    LANGUAGE="ko_KR.UTF-8" \
    LC_ALL="ko_KR.UTF-8"


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./

EXPOSE 8080

CMD ["npm", "run", "start:prod"]