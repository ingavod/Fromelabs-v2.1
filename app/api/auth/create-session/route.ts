import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener info del dispositivo del header
    const userAgent = request.headers.get('user-agent') || 'Desconocido'
    const deviceInfo = getDeviceInfo(userAgent)

    // Generar nuevo token de sesión
    const sessionToken = crypto.randomUUID()

    // Actualizar sesión activa
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        activeSessionToken: sessionToken,
        activeSessionCreatedAt: new Date(),
        activeSessionDevice: deviceInfo
      }
    })

    return NextResponse.json({ 
      success: true,
      sessionToken,
      message: 'Nueva sesión creada correctamente' 
    })

  } catch (error) {
    console.error('Error creando sesión:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

function getDeviceInfo(userAgent: string): string {
  // Detectar tipo de dispositivo
  if (/mobile/i.test(userAgent)) {
    if (/android/i.test(userAgent)) return 'Android'
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS'
    return 'Móvil'
  }
  
  if (/tablet/i.test(userAgent)) return 'Tablet'
  
  // Detectar navegador de escritorio
  if (/chrome/i.test(userAgent)) return 'Chrome (Escritorio)'
  if (/firefox/i.test(userAgent)) return 'Firefox (Escritorio)'
  if (/safari/i.test(userAgent)) return 'Safari (Escritorio)'
  if (/edge/i.test(userAgent)) return 'Edge (Escritorio)'
  
  return 'Navegador Desconocido'
}
