FROM node:18-alpine


WORKDIR /srv/app
COPY . .

RUN npm i

USER node
CMD npm run start

