import { NextResponse } from 'next/server'
import { ZodError } from 'zod/v4'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: error.issues.map(i => i.message) },
      { status: 400 },
    )
  }

  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode })
  }

  console.error('Unhandled API error:', error)
  return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
}
