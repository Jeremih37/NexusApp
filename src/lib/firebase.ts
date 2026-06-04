import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId)

let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let googleProvider: GoogleAuthProvider | null = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    authInstance = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    // Request additional scopes
    googleProvider.addScope('profile')
    googleProvider.addScope('email')
    // Always show account selector
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    })
  } catch (error) {
    console.warn('Firebase initialization failed:', error)
    app = null
    authInstance = null
    googleProvider = null
  }
}

export const auth = authInstance
export { googleProvider }
