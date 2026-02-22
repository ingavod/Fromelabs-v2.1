import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-config'
import { passwordResetEmail } from '@/lib/email-templates'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      )
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Por seguridad, siempre devolvemos éxito (no revelamos si el email existe)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña.',
      })
    }

    // Generar token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // Expira en 1 hora

    // Guardar token
    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expires,
      },
    })

    // Construir URL de reset
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    // Enviar email
    await sendEmail({
      to: user.email,
      subject: 'Recuperar contraseña - From E Labs',
      html: passwordResetEmail(user.name || 'Usuario', resetUrl),
    })

    return NextResponse.json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña.',
    })

  } catch (error: any) {
    console.error('Error en forgot password:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
