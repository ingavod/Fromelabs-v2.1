import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { phone, identification, address, city, postalCode, country } = body

    // Validaciones
    if (!phone || !identification || !address || !city || !postalCode || !country) {
      return NextResponse.json(
        { error: 'All billing fields are required' },
        { status: 400 }
      )
    }

    // Actualizar usuario con datos de facturación
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phone,
        identification,
        address,
        city,
        postalCode,
        country,
      },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Billing information saved successfully'
    })

  } catch (error: any) {
    console.error('Error saving billing data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
