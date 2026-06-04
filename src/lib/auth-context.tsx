'use client'

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'
import { api, setAuthTokenGetter } from '@/lib/api'

// Demo user for when Firebase is not configured
const DEMO_USER = {
  id: '',
  name: 'Carlos García',
  email: 'carlos@nexusapp.com',
  avatar: 'CG',
  role: 'user',
}

interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  firebaseUser: FirebaseUser | null
  isLoading: boolean
  isDemoMode: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const firebaseUserRef = useRef<FirebaseUser | null>(null)

  // Keep the ref in sync with state
  useEffect(() => {
    firebaseUserRef.current = firebaseUser
  }, [firebaseUser])

  useEffect(() => {
    // Set up the auth token getter for API calls
    setAuthTokenGetter(async () => {
      if (!isFirebaseConfigured || !firebaseUserRef.current) return null
      return firebaseUserRef.current.getIdToken()
    })

    if (!isFirebaseConfigured || !auth) {
      // Demo mode: load the hardcoded user from the API
      api.users.getByEmail(DEMO_USER.email).then((userData) => {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar || 'U',
          role: userData.role || 'user',
        })
        setIsLoading(false)
      }).catch(() => {
        setUser({ ...DEMO_USER, id: 'demo' })
        setIsLoading(false)
      })
      return
    }

    // Real Firebase mode
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        try {
          // Try to find user in our DB by email
          const userData = await api.users.getByEmail(fbUser.email!)
          setUser({
            id: userData.id,
            name: userData.name || fbUser.displayName || '',
            email: userData.email || fbUser.email || '',
            avatar: userData.avatar || fbUser.displayName?.charAt(0)?.toUpperCase() || 'U',
            role: userData.role || 'user',
          })
        } catch {
          // User exists in Firebase but not in our DB yet - create profile
          setUser({
            id: '',
            name: fbUser.displayName || '',
            email: fbUser.email || '',
            avatar: fbUser.displayName?.charAt(0)?.toUpperCase() || 'U',
            role: 'user',
          })
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      // Demo mode login - just look up the user by email
      const userData = await api.users.getByEmail(email)
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar || 'U',
        role: userData.role || 'user',
      })
      return
    }

    await signInWithEmailAndPassword(auth, email, password)
    // onAuthStateChanged will handle setting the user
  }

  const register = async (name: string, email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      // Demo mode: cannot register new users
      throw new Error('El modo demo no permite registro. Configura Firebase para habilitarlo.')
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name })
    // onAuthStateChanged will handle setting the user
  }

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      // In demo mode, re-login as the demo user
      try {
        const userData = await api.users.getByEmail(DEMO_USER.email)
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar || 'U',
          role: userData.role || 'user',
        })
      } catch {
        setUser({ ...DEMO_USER, id: 'demo' })
      }
      return
    }

    await firebaseSignOut(auth)
    setUser(null)
    setFirebaseUser(null)
  }

  const getIdToken = async (): Promise<string | null> => {
    if (!isFirebaseConfigured || !firebaseUser) return null
    return firebaseUser.getIdToken()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isDemoMode: !isFirebaseConfigured,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
