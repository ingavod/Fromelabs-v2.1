import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-config'

// Umbrales de alerta (porcentajes)
const ALERT_THRESHOLDS = {
  WARNING: 0.8,   // 80% del límite
  CRITICAL: 0.95, // 95% del límite
}

interface UsageAlert {
  userId: string
  email: string
  name: string | null
  plan: string
  used: number
  limit: number
  percentage: number
  level: 'warning' | 'critical' | 'exceeded'
}

/**
 * Verifica el uso de un usuario y determina si necesita alerta
 */
export async function checkUserUsage(userId: string): Promise<UsageAlert | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      messagesUsed: true,
      messagesLimit: true,
    },
  })

  if (!user) return null

  const percentage = user.messagesUsed / user.messagesLimit

  let level: 'warning' | 'critical' | 'exceeded' | null = null

  if (percentage >= 1) {
    level = 'exceeded'
  } else if (percentage >= ALERT_THRESHOLDS.CRITICAL) {
    level = 'critical'
  } else if (percentage >= ALERT_THRESHOLDS.WARNING) {
    level = 'warning'
  }

  if (!level) return null

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    used: user.messagesUsed,
    limit: user.messagesLimit,
    percentage,
    level,
  }
}

/**
 * Genera el HTML del email de alerta (bilingüe)
 */
function generateUsageAlertEmail(alert: UsageAlert): string {
  const percentageText = Math.round(alert.percentage * 100)
  const remaining = alert.limit - alert.used

  const messages = {
    warning: {
      titleEs: 'Te estás acercando a tu límite',
      titleEn: 'You are approaching your limit',
      messageEs: `Has usado ${alert.used} de ${alert.limit} mensajes de tu plan ${alert.plan}. Considera actualizar tu plan para no quedarte sin acceso.`,
      messageEn: `You have used ${alert.used} of ${alert.limit} messages from your ${alert.plan} plan. Consider upgrading your plan to avoid losing access.`,
    },
    critical: {
      titleEs: 'Casi sin mensajes disponibles',
      titleEn: 'Almost out of messages',
      messageEs: `Solo te quedan ${remaining} mensajes de ${alert.limit}. Actualiza tu plan ahora para seguir usando From E sin interrupciones.`,
      messageEn: `You only have ${remaining} messages left out of ${alert.limit}. Upgrade your plan now to continue using From E without interruptions.`,
    },
    exceeded: {
      titleEs: 'Límite alcanzado',
      titleEn: 'Limit reached',
      messageEs: `Has alcanzado el límite de ${alert.limit} mensajes de tu plan ${alert.plan}. Actualiza tu plan para continuar usando From E.`,
      messageEn: `You have reached the limit of ${alert.limit} messages from your ${alert.plan} plan. Upgrade your plan to continue using From E.`,
    },
  }

  const msg = messages[alert.level]
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Colores From E Labs
  const colors = {
    bg: '#0a0a0a',
    surface: '#111111',
    navy: '#1e40af',
    text: '#e5e5e5',
    textSub: '#a3a3a3',
    warning: '#f59e0b',
    critical: '#ef4444',
  }

  const iconColor = alert.level === 'warning' ? colors.warning : colors.critical

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background: ${colors.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: ${colors.bg}; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background: ${colors.surface}; border-radius: 12px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="padding: 32px; text-align: center; border-bottom: 1px solid #2a2a2a;">
                  <h1 style="margin: 0; color: ${colors.text}; font-size: 24px; font-weight: 600;">From E Labs</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  <!-- Icon -->
                  <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); position: relative;">
                      <svg style="position: absolute; top: 16px; left: 16px; width: 32px; height: 32px;" fill="none" stroke="${iconColor}" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                    </div>
                  </div>

                  <!-- Spanish Version -->
                  <h2 style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 20px; text-align: center;">${msg.titleEs}</h2>
                  <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6; text-align: center;">
                    Hola ${alert.name || 'Usuario'},
                  </p>
                  <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
                    ${msg.messageEs}
                  </p>

                  <!-- Usage Bar -->
                  <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <div style="margin-bottom: 8px;">
                      <span style="color: ${colors.textSub}; font-size: 14px;">Uso actual / Current usage:</span>
                    </div>
                    <div style="background: #2a2a2a; border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 8px;">
                      <div style="background: ${iconColor}; height: 100%; width: ${percentageText}%;"></div>
                    </div>
                    <div style="text-align: center;">
                      <span style="color: ${colors.text}; font-size: 24px; font-weight: 600;">${alert.used} / ${alert.limit}</span>
                      <span style="color: ${colors.textSub}; font-size: 14px; margin-left: 8px;">(${percentageText}%)</span>
                    </div>
                  </div>

                  <!-- English Version -->
                  <div style="border-top: 1px solid #2a2a2a; padding-top: 24px; margin-top: 24px;">
                    <p style="margin: 0 0 16px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6; text-align: center;">
                      Hello ${alert.name || 'User'},
                    </p>
                    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
                      ${msg.messageEn}
                    </p>
                  </div>

                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                    <tr>
                      <td align="center">
                        <a href="${appUrl}/pricing" style="display: inline-block; padding: 14px 32px; background: ${colors.navy}; color: ${colors.text}; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          Ver Planes / View Plans
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; text-align: center; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0; color: ${colors.textSub}; font-size: 14px;">
                    © 2026 From E Labs. Todos los derechos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Envía email de alerta según el nivel
 */
export async function sendUsageAlert(alert: UsageAlert): Promise<boolean> {
  const percentageText = Math.round(alert.percentage * 100)
  
  const subjects = {
    warning: `⚠️ ${percentageText}% de tus mensajes usados - From E Labs`,
    critical: `🚨 CRÍTICO: ${percentageText}% de tus mensajes usados - From E Labs`,
    exceeded: `🛑 Límite de mensajes alcanzado - From E Labs`,
  }

  const html = generateUsageAlertEmail(alert)

  const result = await sendEmail({
    to: alert.email,
    subject: subjects[alert.level],
    html,
  })

  return result.success
}

/**
 * Verifica todos los usuarios y envía alertas si es necesario
 * Útil para ejecutar en un cron job
 */
export async function checkAllUsersAndAlert(): Promise<{
  checked: number
  alerted: number
  errors: number
}> {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true },
  })

  let alerted = 0
  let errors = 0

  for (const user of users) {
    try {
      const alert = await checkUserUsage(user.id)
      if (alert) {
        const sent = await sendUsageAlert(alert)
        if (sent) alerted++
        else errors++
      }
    } catch (error) {
      console.error(`Error checking user ${user.id}:`, error)
      errors++
    }
  }

  return {
    checked: users.length,
    alerted,
    errors,
  }
}
