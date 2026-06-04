'use client'

import { Gamepad2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function DemoBanner() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-10 h-10 glass-dark rounded-xl flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="glass-dark border-0 text-gray-200 text-xs font-semibold">
              Modo Demo
            </Badge>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Firebase no esta configurado. Usa las credenciales de prueba para acceder:
          </p>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 text-sm font-mono text-gray-300 border border-white/[0.06]">
            carlos@nexusapp.com / cualquier contrasena
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Configura las variables de entorno de Firebase para habilitar la autenticacion real.
          </p>
        </div>
      </div>
    </div>
  )
}
