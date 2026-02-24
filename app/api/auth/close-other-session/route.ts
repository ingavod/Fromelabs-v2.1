import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Cerrar la sesión activa anterior
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        activeSessionToken: null,
        activeSessionCreatedAt: null,
        activeSessionDevice: null
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Sesión anterior cerrada correctamente' 
    })

  } catch (error) {
    console.error('Error cerrando sesión:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
