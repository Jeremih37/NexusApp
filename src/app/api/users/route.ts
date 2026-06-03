import { userService } from '@/services/user.service'
import { handleApiError, ApiError } from '@/lib/api-error'
import { userQuerySchema } from '@/schemas/user.schema'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validated = userQuerySchema.parse({
      email: searchParams.get('email') || undefined,
    })

    if (validated.email) {
      const user = await userService.findByEmail(validated.email)
      if (user) return NextResponse.json(user)
    }

    const user = await userService.findDefault()
    if (!user) {
      throw new ApiError(404, 'No se encontró usuario')
    }

    return NextResponse.json(user)
  } catch (error) {
    return handleApiError(error)
  }
}
