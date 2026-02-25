import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-config'
import { costAlertEmail } from '@/lib/email-templates'

// En producción, esto estaría en una tabla de configuración
let COST_THRESHOLD = 100.0
let LAST_ALERT_SENT = 0 // Timestamp para evitar spam de emails

const ALERT_COOLDOWN = 24 * 60 * 60 * 1000 // 24 horas en ms

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ threshold: COST_THRESHOLD })

  } catch (error: any) {
    console.error('Error getting threshold:', error)
    return NextResponse.json(
      { error: 'Error al obtener umbral' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { threshold, currentCost } = await req.json()

    if (typeof threshold !== 'number' || threshold < 0) {
      return NextResponse.json(
        { error: 'Umbral inválido' },
        { status: 400 }
      )
    }

    COST_THRESHOLD = threshold

    // Si el coste actual supera el 80% del umbral, enviar alerta
    if (currentCost && currentCost > threshold * 0.8) {
      const now = Date.now()
      // Solo enviar si han pasado 24h desde la última alerta
      if (now - LAST_ALERT_SENT > ALERT_COOLDOWN) {
        await sendCostAlert(currentCost, threshold)
        LAST_ALERT_SENT = now
      }
    }

    return NextResponse.json({ success: true, threshold })

  } catch (error: any) {
    console.error('Error setting threshold:', error)
    return NextResponse.json(
      { error: 'Error al guardar umbral' },
      { status: 500 }
    )
  }
}

async function sendCostAlert(currentCost: number, threshold: number) {
  try {
    // Obtener todos los administradores y superusuarios
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPER'],
        },
        isActive: true,
      },
      select: {
        email: true,
        name: true,
      },
    })

    const percentage = Math.round((currentCost / threshold) * 100)

    // Enviar email a cada administrador
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: `⚠️ Alerta: Costes API al ${percentage}% del umbral - From E Labs`,
        html: costAlertEmail(
          admin.name || 'Administrador',
          currentCost,
          threshold,
          percentage
        ),
      })
      console.log(`📧 Cost alert sent to ${admin.email}`)
    }

    console.log(`✅ Cost alert emails sent to ${admins.length} administrators`)
  } catch (error) {
    console.error('Error sending cost alert emails:', error)
  }
}
