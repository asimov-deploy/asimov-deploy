FROM node:9-alpine

WORKDIR /asimov-deploy/
COPY package.json .
ENV NODE_ENV production

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ && \
        npm set progress=false && \
        npm config set depth 0 && \
        npm install && \
        npm cache verify && \
        apk del .gyp

# RUN npm set progress=false && \
#     npm config set depth 0 && \
#     npm install && \
#     npm cache clean

COPY  . /asimov-deploy/

EXPOSE 3333

CMD [ "npm", "start" ]
