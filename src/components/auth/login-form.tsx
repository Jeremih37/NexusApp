'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react'
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
  const { login, isDemoMode } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      router.push('/')
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Iniciar Sesión</h1>
        <p className="text-gray-400">Accede a tu cuenta de NexusApp</p>
      </div>

      {isDemoMode && (
        <div className="mb-6">
          <DemoBanner />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Correo Electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/20 focus:ring-white/10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/20 focus:ring-white/10"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 h-12 shadow-lg shadow-white/10 transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-gray-300 hover:text-white font-medium transition-colors">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
