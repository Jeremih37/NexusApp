'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[150px]" />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
