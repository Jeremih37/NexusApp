#!/bin/bash
set -e
npx prisma generate
npx prisma db push --accept-data-loss 2>/dev/null || echo "DB push skipped (may already be in sync)"
next build
