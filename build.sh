#!/bin/bash
set -e
npx prisma generate
npx prisma db push --skip-generate
node prisma/seed.ts
next build
