export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 mt-12 pattern-leopard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-700 to-amber-500 rounded-lg flex items-center justify-center font-bold text-xs">
              N
            </div>
            <span className="font-bold">Nexus<span className="text-amber-400">App</span></span>
          </div>
          <p className="text-gray-500 text-sm">Tu plataforma para descubrir, evaluar y descargar videojuegos</p>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="text-sm">2025 NexusApp</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
