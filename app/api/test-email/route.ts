import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sendEmail } from '@/lib/email-config'
import { verificationEmail, welcomeEmail, passwordResetEmail, limitReachedEmail, paymentConfirmationEmail } from '@/lib/email-templates'

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    // Solo admins pueden probar emails
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const { type, to } = body

    if (!to) {
      return NextResponse.json({ error: 'Email destinatario requerido' }, { status: 400 })
    }

    let html = ''
    let subject = ''

    switch (type) {
      case 'verification':
        subject = 'Verifica tu email - From E Labs'
        html = verificationEmail('Usuario Test', 'http://localhost:3000/verify?token=test123')
        break
      
      case 'welcome':
        subject = 'Bienvenido a From E Labs'
        html = welcomeEmail('Usuario Test')
        break
      
      case 'password-reset':
        subject = 'Recuperar contraseña - From E Labs'
        html = passwordResetEmail('Usuario Test', 'http://localhost:3000/reset-password?token=test123')
        break
      
      case 'limit-reached':
        subject = 'Límite de mensajes alcanzado - From E Labs'
        html = limitReachedEmail('Usuario Test', 'FREE', 50, 50)
        break
      
      case 'payment':
        subject = 'Pago confirmado - From E Labs'
        html = paymentConfirmationEmail('Usuario Test', 'PRO', '€19.99/mes')
        break
      
      default:
        return NextResponse.json({ error: 'Tipo de email no válido' }, { status: 400 })
    }

    const result = await sendEmail({ to, subject, html })

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email enviado correctamente',
        messageId: result.messageId 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Error en test de email:', error)
    return NextResponse.json({ 
      error: 'Error al enviar email',
      details: error.message 
    }, { status: 500 })
  }
}
