'use client'

import { Gamepad2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function DemoBanner() {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Gamepad2 className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-amber-500/50 text-amber-300 bg-amber-500/20 text-xs">
              Modo Demo
            </Badge>
          </div>
          <p className="text-sm text-amber-200/80">
            Firebase no está configurado. Usa las credenciales de prueba para acceder:
          </p>
          <div className="mt-2 bg-black/30 rounded-lg px-3 py-2 text-sm font-mono text-amber-300">
            carlos@nexusapp.com / cualquier contraseña
          </div>
          <p className="text-xs text-amber-200/50 mt-2">
            Configura las variables de entorno de Firebase para habilitar la autenticación real.
          </p>
        </div>
      </div>
    </div>
  )
}
