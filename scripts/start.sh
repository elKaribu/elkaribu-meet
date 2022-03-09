#!/bin/sh
set -x

/calcom/scripts/wait.sh ${DATABASE_HOST} -- echo "database is up"
npx prisma migrate deploy --schema /calcom/packages/prisma/schema.prisma
yarn start