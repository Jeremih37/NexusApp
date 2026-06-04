'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn, Mail, Lock, Loader2, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { DemoBanner } from './demo-banner'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { login, loginWithGoogle, isDemoMode } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      router.push('/')
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesion. Verifica tus credenciales.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setIsGoogleLoading(true)

    try {
      await loginWithGoogle()
      router.push('/')
    } catch (err: any) {
      // Handle common Google Auth errors
      if (err?.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show error
      } else if (err?.code === 'auth/cancelled-popup-request') {
        // Popup was cancelled, don't show error
      } else {
        setError(err?.message || 'Error al iniciar sesion con Google. Intenta de nuevo.')
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Gamepad2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black mb-2">Iniciar Sesion</h1>
        <p className="text-gray-400">Accede a tu cuenta de NexusApp</p>
      </div>

      {isDemoMode && (
        <div className="mb-6">
          <DemoBanner />
        </div>
      )}

      {/* Google Sign In Button */}
      {!isDemoMode && (
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 h-12 bg-white hover:bg-gray-100 text-black font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(255,255,255,0.12)] hover:shadow-[0_0_35px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed btn-premium"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continuar con Google
          </button>
        </div>
      )}

      {/* Divider */}
      {!isDemoMode && (
        <div className="relative mb-6">
          <div className="gradient-line" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4">
            <span className="text-gray-500 text-sm">o</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="glass-card rounded-xl p-4 text-sm text-red-300 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 font-medium">
            Correo Electronico
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-11 bg-white/[0.04] border-white/[0.08] text-white placeholder-gray-500 focus:border-white/15 focus:ring-white/20 rounded-xl h-12 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300 font-medium">
            Contrasena
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="........"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-11 bg-white/[0.04] border-white/[0.08] text-white placeholder-gray-500 focus:border-white/15 focus:ring-white/20 rounded-xl h-12 transition-all"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 h-12 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.25)] transition-all rounded-xl btn-premium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Iniciando sesion...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesion
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <div className="gradient-line mb-6" />
        <p className="text-gray-400 text-sm">
          No tienes cuenta?{' '}
          <Link href="/register" className="text-white font-semibold hover:underline transition-all">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}
