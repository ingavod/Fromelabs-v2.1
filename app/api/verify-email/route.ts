import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-config'
import { welcomeEmail } from '@/lib/email-templates'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 400 }
      )
    }

    // Buscar token de verificación
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Verificar si el token ha expirado
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.json(
        { error: 'El token ha expirado. Por favor solicita uno nuevo.' },
        { status: 400 }
      )
    }

    // Actualizar usuario
    const user = await prisma.user.update({
      where: { email: verificationToken.email },
      data: {
        emailVerified: true,
        isActive: true,
      },
    })

    // Eliminar token usado
    await prisma.verificationToken.delete({
      where: { token },
    })

    // Enviar email de bienvenida
    await sendEmail({
      to: user.email,
      subject: 'Bienvenido a From E Labs',
      html: welcomeEmail(user.name || 'Usuario'),
    })

    return NextResponse.json({
      success: true,
      message: 'Email verificado correctamente',
    })

  } catch (error: any) {
    console.error('Error en verificación:', error)
    return NextResponse.json(
      { error: 'Error al verificar el email' },
      { status: 500 }
    )
  }
}
