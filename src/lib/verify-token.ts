import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

// This is for server-side only
const FIREBASE_ADMIN_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
}

let adminApp: ReturnType<typeof initializeApp> | null = null

function getAdminApp() {
  if (adminApp) return adminApp
  if (!FIREBASE_ADMIN_CONFIG.projectId || !FIREBASE_ADMIN_CONFIG.clientEmail || !FIREBASE_ADMIN_CONFIG.privateKey) {
    return null
  }

  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert(FIREBASE_ADMIN_CONFIG),
    })
  } else {
    adminApp = getApps()[0]
  }
  return adminApp
}

export async function verifyIdToken(idToken: string) {
  const app = getAdminApp()
  if (!app) {
    // No Firebase Admin configured - skip verification
    return null
  }

  try {
    const decodedToken = await getAuth(app).verifyIdToken(idToken)
    return decodedToken
  } catch {
    return null
  }
}
