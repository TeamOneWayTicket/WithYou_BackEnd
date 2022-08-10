FROM node:16

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
EXPOSE 8080

CMD ["npm", "run", "start:prod"]