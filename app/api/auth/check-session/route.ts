import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        activeSessionToken: true,
        activeSessionCreatedAt: true,
        activeSessionDevice: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      hasActiveSession: !!user.activeSessionToken,
      sessionInfo: user.activeSessionToken ? {
        device: user.activeSessionDevice || 'Dispositivo desconocido',
        createdAt: user.activeSessionCreatedAt
      } : null
    })

  } catch (error) {
    console.error('Error verificando sesión:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
