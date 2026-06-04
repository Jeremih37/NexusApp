'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Heart, LogIn, LogOut, User } from 'lucide-react'
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
  { href: '/catalog', label: 'Catálogo', icon: LayoutGrid },
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
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/5 pattern-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-bold text-sm text-black shadow-lg shadow-white/10">
              N
            </div>
            <span className="text-xl font-bold tracking-tight">Nexus<span className="text-gray-400">App</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive(item.href)
                      ? 'bg-white/10 text-white border border-white/15'
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
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-xs font-bold text-black">
                      {avatarInitial}
                    </div>
                    <span className="text-sm font-medium text-gray-300 hidden lg:inline">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  {isDemoMode && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <div className="px-2 py-1.5">
                        <Badge variant="outline" className="border-gray-500/50 text-gray-300 bg-white/5 text-xs">
                          Modo Demo
                        </Badge>
                      </div>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800 cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-red-400 focus:text-red-300 focus:bg-gray-800 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-white hover:bg-gray-200 text-black gap-2 shadow-lg shadow-white/10 font-semibold">
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="flex sm:hidden items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    isActive(item.href)
                      ? 'bg-white/10 text-white'
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
                  <button className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-[10px] font-bold text-black">
                    {avatarInitial}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800 cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-red-400 focus:text-red-300 focus:bg-gray-800 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                  <LogIn className="w-3.5 h-3.5 text-black" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
