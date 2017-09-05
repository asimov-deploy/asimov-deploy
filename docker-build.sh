#!/bin/bash
set -ev

rm -rf docker-build

docker build -t asimov-deploy/asimov-deploy:build . -f Dockerfile.build
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

docker build -t asimov-deploy/asimov-deploy:latest .

PACKAGE_VERSION=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)

echo Building asimov-deploy/asimov-deploy:$PACKAGE_VERSION
docker build -t asimov-deploy/asimov-deploy:$PACKAGE_VERSION .