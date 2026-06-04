import { Gamepad2, Github, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative mt-16">
      {/* Top gradient line */}
      <div className="gradient-line" />

      <div className="bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  <Gamepad2 className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-black">Nexus<span className="text-gray-400 font-bold">App</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Tu plataforma para descubrir, evaluar y descargar los mejores videojuegos. Todo en un solo lugar.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Navegacion</h4>
              <div className="flex flex-col gap-2.5">
                <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">Inicio</a>
                <a href="/catalog" className="text-gray-500 hover:text-white text-sm transition-colors">Catalogo</a>
                <a href="/favorites" className="text-gray-500 hover:text-white text-sm transition-colors">Favoritos</a>
              </div>
            </div>

            {/* Social / info */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Comunidad</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="gradient-line mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs">2025 NexusApp. Todos los derechos reservados.</p>
            <p className="text-gray-700 text-xs">Hecho con pasion por los videojuegos</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
