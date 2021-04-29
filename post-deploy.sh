#!/bin/bash -e

pushd backend
rm -rf node_modules
npm install
npm run build
popd

pushd frontend
rm -rf node_modules
npm install
npm run build
popd