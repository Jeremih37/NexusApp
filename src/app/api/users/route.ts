import { db, ensureDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await ensureDB()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (email) {
      const user = await db.user.findUnique({ where: { email } })
      if (user) return NextResponse.json(user)
    }

    const user = await db.user.findFirst({ where: { role: 'user' } })
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 })
  }
}
