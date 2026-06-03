import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl() {
  if (process.env.VERCEL === '1') {
    return 'file:/tmp/nexusapp.db'
  }
  return process.env.DATABASE_URL || 'file:./db/custom.db'
}

let dbInitialized = false

function initVercelDB() {
  if (process.env.VERCEL !== '1' || dbInitialized) return
  
  const tmpDbPath = '/tmp/nexusapp.db'
  
  // If DB already exists at /tmp, use it
  if (fs.existsSync(tmpDbPath)) {
    dbInitialized = true
    return
  }
  
  try {
    // Push schema to create tables
    process.env.DATABASE_URL = `file:${tmpDbPath}`
    execSync('npx prisma db push --skip-generate', { 
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: `file:${tmpDbPath}` }
    })
    console.log('Schema pushed to /tmp/nexusapp.db')
  } catch (e) {
    console.error('Failed to push schema:', e)
  }
  
  dbInitialized = true
}

// For Vercel: initialize DB on module load
if (process.env.VERCEL === '1') {
  initVercelDB()
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [],
    datasourceUrl: getDatabaseUrl(),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Auto-seed function for Vercel
let seeded = false
export async function ensureDB() {
  if (seeded) return
  if (process.env.VERCEL !== '1') { seeded = true; return }
  
  try {
    const count = await db.game.count()
    if (count > 0) { seeded = true; return }
    
    // Call the seed API to populate data
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
    if (baseUrl) {
      await fetch(`${baseUrl}/api/seed`)
    }
  } catch (e) {
    console.error('ensureDB error:', e)
  }
  seeded = true
}
