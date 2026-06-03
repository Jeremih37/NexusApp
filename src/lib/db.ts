import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl() {
  // On Vercel, use /tmp for the SQLite database (writable filesystem)
  if (process.env.VERCEL === '1') {
    return 'file:/tmp/nexusapp.db'
  }
  return process.env.DATABASE_URL || 'file:./db/custom.db'
}

// Set the DATABASE_URL dynamically for Vercel
if (process.env.VERCEL === '1' && !process.env.DATABASE_URL_SET) {
  process.env.DATABASE_URL = getDatabaseUrl()
  process.env.DATABASE_URL_SET = '1'
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
