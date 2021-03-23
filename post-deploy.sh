#!/bin/bash -e

pushd backend
npm install
npm run prebuild
popd

pushd frontend
npm install
npm run build
popd