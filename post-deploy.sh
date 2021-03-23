#!/bin/bash -e

pushd backend
npm install
npm run prebuild
npm run build
popd

pushd frontend
npm install
npm run build
popd