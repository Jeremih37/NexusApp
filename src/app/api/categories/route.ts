import { categoryService } from '@/services/category.service'
import { handleApiError } from '@/lib/api-error'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await categoryService.findAll()
    return NextResponse.json(categories)
  } catch (error) {
    return handleApiError(error)
  }
}
