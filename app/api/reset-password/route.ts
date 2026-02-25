import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 12) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 12 caracteres' },
        { status: 400 }
      )
    }

    // Buscar token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Verificar expiración
    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { token },
      })
      return NextResponse.json(
        { error: 'El token ha expirado. Por favor solicita uno nuevo.' },
        { status: 400 }
      )
    }

    // Hash de la nueva contraseña
    const passwordHash = await hash(password, 12)

    // Actualizar contraseña
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    })

    // Eliminar token usado
    await prisma.passwordResetToken.delete({
      where: { token },
    })

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    })

  } catch (error: any) {
    console.error('Error en reset password:', error)
    return NextResponse.json(
      { error: 'Error al restablecer la contraseña' },
      { status: 500 }
    )
  }
}
