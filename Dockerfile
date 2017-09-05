FROM node:boron-alpine
WORKDIR /asimov-deploy/
COPY package.json .
ENV NODE_ENV production

RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install && \
    npm cache clean

COPY docker-build .

EXPOSE 3333

CMD [ "npm", "start" ]