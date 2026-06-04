'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { DemoBanner } from './demo-banner'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, isDemoMode } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('El formato del correo electrónico no es válido.')
      return
    }

    // Validate name
    if (name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.')
      return
    }

    setIsSubmitting(true)

    try {
      await register(name, email, password)
      router.push('/')
    } catch (err: any) {
      setError(err?.message || 'Error al crear la cuenta. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isDemoMode) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Crear Cuenta</h1>
          <p className="text-gray-400">Regístrate en NexusApp</p>
        </div>

        <DemoBanner />

        <div className="mt-6 bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
          <UserPlus className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Firebase no configurado</h3>
          <p className="text-sm text-gray-500 mb-4">
            El registro de nuevas cuentas requiere Firebase Authentication. En modo demo, solo puedes usar la cuenta de prueba existente.
          </p>
          <Link href="/login">
            <Button className="bg-white hover:bg-gray-200 text-black">
              Ir a Iniciar Sesión
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Crear Cuenta</h1>
        <p className="text-gray-400">Regístrate en NexusApp</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">
            Nombre
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/20 focus:ring-white/10"
            />
          </div>
        </div>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/20 focus:ring-white/10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-300">
            Confirmar Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
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
              Creando cuenta...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Cuenta
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
