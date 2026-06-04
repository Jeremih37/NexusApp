'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Heart, LogIn, LogOut, User, Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/catalog', label: 'Catalogo', icon: LayoutGrid },
  { href: '/favorites', label: 'Favoritos', icon: Heart },
]

export function Header() {
  const pathname = usePathname()
  const { user, isAuthenticated, isDemoMode, logout } = useAuth()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const avatarInitial = user?.avatar || user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06]">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
      <div className="absolute inset-0 mesh-gradient opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-shadow">
              <Gamepad2 className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight">Nexus<span className="text-gray-400 font-bold">App</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-1 glass-card rounded-2xl p-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    isActive(item.href)
                      ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop User Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 glass-card px-3 py-2 rounded-2xl hover:bg-white/[0.08] transition-all">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-xs font-bold text-black">
                      {avatarInitial}
                    </div>
                    <span className="text-sm font-medium text-gray-300 hidden lg:inline">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  {isDemoMode && (
                    <>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <div className="px-2 py-1.5">
                        <Badge variant="outline" className="glass-card border-0 text-gray-300 text-xs">
                          Modo Demo
                        </Badge>
                      </div>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/5 cursor-pointer rounded-xl">
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-red-400 focus:text-red-300 focus:bg-white/5 cursor-pointer rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-white hover:bg-gray-100 text-black gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] font-bold rounded-xl btn-premium">
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesion
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="flex sm:hidden items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'p-2.5 rounded-xl transition-all',
                    isActive(item.href)
                      ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                      : 'text-gray-400'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              )
            })}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-[11px] font-bold text-black ml-1">
                    {avatarInitial}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/5 cursor-pointer rounded-xl">
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-red-400 focus:text-red-300 focus:bg-white/5 cursor-pointer rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="ml-1">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.15)]">
                  <LogIn className="w-4 h-4 text-black" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 gradient-line" />
    </header>
  )
}
