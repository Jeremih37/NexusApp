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
      setError(err?.message || 'Error al iniciar sesion. Verifica tus credenciales.')
    } finally {
      setIsSubmitting(false)
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
