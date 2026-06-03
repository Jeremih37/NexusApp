#!/bin/bash
set -e
npx prisma generate
next build
