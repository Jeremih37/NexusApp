#!/bin/bash
set -e
npx prisma generate
if [ -n "$DATABASE_URL" ]; then
  npx prisma db push --accept-data-loss 2>/dev/null || echo "DB push skipped"
else
  echo "No DATABASE_URL set, skipping DB push"
fi
next build
