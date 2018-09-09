FROM node:10 as build_and_test

WORKDIR /asimov-deploy/

COPY package.json .
COPY package-lock.json .

RUN npm set progress=false && \
        npm ci

COPY  . /asimov-deploy/

RUN npm test

################################################

FROM node:10-alpine as node_modules
ENV NODE_ENV production

RUN apk add --no-cache \
        python \
        make \
        g++

WORKDIR /asimov-deploy/

COPY package.json .
COPY package-lock.json .

RUN npm set progress=false && \
        npm ci

################################################

FROM node:10-alpine 
ENV NODE_ENV production

WORKDIR /asimov-deploy/

COPY  . /asimov-deploy/
COPY --from=build_and_test /asimov-deploy/dist dist
COPY --from=node_modules /asimov-deploy/node_modules node_modules

EXPOSE 3333

CMD [ "npm", "start" ]
