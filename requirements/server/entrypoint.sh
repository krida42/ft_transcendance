#!/bin/sh

npm install

# npm run build

npm run db:migrate

npm run db:seed-dev

exec npm run start:dev
