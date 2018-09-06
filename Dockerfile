FROM node:10 as builder

WORKDIR /asimov-deploy/

COPY package.json .
COPY package-lock.json .

RUN npm set progress=false && \
        npm ci

COPY  . /asimov-deploy/
RUN npm test

FROM node:10-alpine

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++

WORKDIR /asimov-deploy/

COPY package.json .
COPY package-lock.json .

ENV NODE_ENV production

COPY  . /asimov-deploy/

RUN npm set progress=false && \
        npm ci

RUN apk del .gyp

COPY --from=builder /asimov-deploy/dist dist


EXPOSE 3333

CMD [ "npm", "start" ]
