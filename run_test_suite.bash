#!/bin/sh

./node_modules/.bin/mocha -R spec -t 3000 -S --grep $1
echo Done.
