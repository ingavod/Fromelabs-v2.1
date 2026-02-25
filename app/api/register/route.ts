import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-config'
import { verificationEmail } from '@/lib/email-templates'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { name, lastName, email, password } = await req.json()

    // Validaciones
    if (!name || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 12) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 12 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const passwordHash = await hash(password, 12)

    // Crear usuario (sin verificar)
    const user = await prisma.user.create({
      data: {
        name,
        lastName,
        email: email.toLowerCase(),
        passwordHash,
        role: 'USER',
        plan: 'FREE',
        messagesLimit: 10,
        messagesUsed: 0,
        tokensUsed: 0,
        isActive: false,
        isAdmin: false,
      },
    })

    // Generar token de verificación
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date()
    expires.setHours(expires.getHours() + 24)

    await prisma.verificationToken.create({
      data: {
        email: user.email,
        token,
        expires,
      },
    })

    // Construir URL de verificación
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`

    // Enviar email de verificación
    await sendEmail({
      to: user.email,
      subject: 'Verifica tu email - From E Labs',
      html: verificationEmail(user.name || 'Usuario', verificationUrl),
    })

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado. Por favor verifica tu email para activar tu cuenta.',
      userId: user.id,
    })
  } catch (error: any) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    )
  }
}
