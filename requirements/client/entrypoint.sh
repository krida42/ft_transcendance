#!/bin/sh

npm install

npm run build

exec npx serve -s -l 8080 dist/

# exec npm run serve
