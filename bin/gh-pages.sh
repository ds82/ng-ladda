#!/bin/bash

git checkout gh-pages
git reset --hard master
npm install
git add -f node_modules
git commit -m "doc(demo): add node_modules for demo"
git push -f
git checkout master
