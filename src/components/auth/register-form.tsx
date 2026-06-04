'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus, Mail, Lock, User, Loader2, Gamepad2 } from 'lucide-react'
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

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.')
      return
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('El formato del correo electronico no es valido.')
      return
    }

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
          <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">Crear Cuenta</h1>
          <p className="text-gray-400">Registrate en NexusApp</p>
        </div>

        <DemoBanner />

        <div className="mt-6 glass-card rounded-2xl p-8 text-center">
          <UserPlus className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-300 mb-2">Firebase no configurado</h3>
          <p className="text-sm text-gray-500 mb-4">
            El registro de nuevas cuentas requiere Firebase Authentication. En modo demo, solo puedes usar la cuenta de prueba existente.
          </p>
          <Link href="/login">
            <Button className="bg-white hover:bg-gray-100 text-black font-bold rounded-xl btn-premium shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              Ir a Iniciar Sesion
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <div className="gradient-line mb-6" />
          <p className="text-gray-400 text-sm">
            Ya tienes cuenta?{' '}
            <Link href="/login" className="text-white font-semibold hover:underline transition-all">
              Inicia Sesion
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Gamepad2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black mb-2">Crear Cuenta</h1>
        <p className="text-gray-400">Registrate en NexusApp</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="glass-card rounded-xl p-4 text-sm text-red-300 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300 font-medium">Nombre</Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-11 bg-white/[0.04] border-white/[0.08] text-white placeholder-gray-500 focus:border-white/15 focus:ring-white/20 rounded-xl h-12 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 font-medium">Correo Electronico</Label>
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
          <Label htmlFor="password" className="text-gray-300 font-medium">Contrasena</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="Minimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pl-11 bg-white/[0.04] border-white/[0.08] text-white placeholder-gray-500 focus:border-white/15 focus:ring-white/20 rounded-xl h-12 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">Confirmar Contrasena</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contrasena"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
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

      <div className="mt-8 text-center">
        <div className="gradient-line mb-6" />
        <p className="text-gray-400 text-sm">
          Ya tienes cuenta?{' '}
          <Link href="/login" className="text-white font-semibold hover:underline transition-all">
            Inicia Sesion
          </Link>
        </p>
      </div>
    </div>
  )
}
