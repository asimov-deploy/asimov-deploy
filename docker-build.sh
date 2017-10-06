#!/bin/bash
rm -rf docker-build

docker build -f Dockerfile.build -t asimov-deploy/asimov-deploy:build .
docker run --rm asimov-deploy/asimov-deploy:build
docker create --name extract asimov-deploy/asimov-deploy:build

mkdir -p docker-build/dist/release
docker cp extract:/asimov-deploy/dist/release ./docker-build/dist
docker rm -f extract

cp -r app docker-build
mkdir -p docker-build/public && cp -r public/img docker-build/public
cp -r views docker-build
cp -r library-licenses docker-build
cp package.json docker-build
cp server.js docker-build
cp LICENSE docker-build
cp NOTICE docker-build
