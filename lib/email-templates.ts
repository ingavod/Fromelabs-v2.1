// Colores de From E Labs
const colors = {
  bg: '#0a0a0a',
  surface: '#111111',
  navy: '#1e40af',
  text: '#e5e5e5',
  textSub: '#a3a3a3',
}

// Layout base para todos los emails
function emailLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>From E Labs</title>
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
                  ${content}
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

// Botón estilo From E Labs
function button(text: string, url: string) {
  return `
    <table cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a href="${url}" style="display: inline-block; padding: 14px 32px; background: ${colors.navy}; color: ${colors.text}; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `
}

// Email de verificación
export function verificationEmail(name: string, verificationUrl: string) {
  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 20px;">Verifica tu email</h2>
    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Hola ${name},
    </p>
    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Gracias por registrarte en From E Labs. Para completar tu registro y empezar a usar nuestra IA, por favor verifica tu dirección de email haciendo clic en el botón de abajo:
    </p>
    ${button('Verificar Email', verificationUrl)}
    <p style="margin: 24px 0 0 0; color: ${colors.textSub}; font-size: 14px; line-height: 1.6;">
      Si no creaste esta cuenta, puedes ignorar este email de forma segura.
    </p>
    <p style="margin: 16px 0 0 0; color: #737373; font-size: 12px;">
      Este enlace expirará en 24 horas.
    </p>
  `
  return emailLayout(content)
}

// Email de recuperación de contraseña (bilingüe)
export function passwordResetEmail(name: string, resetUrl: string) {
  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 20px;">Recuperar contraseña / Password Recovery</h2>
    
    <!-- Spanish Version -->
    <p style="margin: 0 0 8px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Hola ${name},
    </p>
    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Recibimos una solicitud para restablecer tu contraseña de From E Labs. Haz clic en el botón de abajo para crear una nueva contraseña:
    </p>
    ${button('Restablecer Contraseña / Reset Password', resetUrl)}
    <p style="margin: 24px 0 0 0; color: ${colors.textSub}; font-size: 14px; line-height: 1.6;">
      Si no solicitaste un cambio de contraseña, puedes ignorar este email de forma segura. Tu contraseña actual seguirá siendo válida.
    </p>
    
    <!-- English Version -->
    <div style="border-top: 1px solid #2a2a2a; margin-top: 24px; padding-top: 24px;">
      <p style="margin: 0 0 8px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
        Hello ${name},
      </p>
      <p style="margin: 0 0 16px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
        We received a request to reset your From E Labs password. Click the button above to create a new password.
      </p>
      <p style="margin: 0; color: ${colors.textSub}; font-size: 14px; line-height: 1.6;">
        If you didn't request a password change, you can safely ignore this email. Your current password will remain valid.
      </p>
    </div>
    
    <p style="margin: 16px 0 0 0; color: #737373; font-size: 12px; text-align: center;">
      Este enlace expirará en 1 hora / This link will expire in 1 hour
    </p>
  `
  return emailLayout(content)
}

// Email de bienvenida
export function welcomeEmail(name: string) {
  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 20px;">Bienvenido a From E Labs</h2>
    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Hola ${name},
    </p>
    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Tu cuenta ha sido verificada exitosamente. Ya puedes empezar a usar From E y conversar con nuestra IA potenciada por Claude Sonnet 4.5.
    </p>
    ${button('Ir al Chat', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/chat')}
    <p style="margin: 24px 0 0 0; color: ${colors.textSub}; font-size: 14px; line-height: 1.6;">
      Si tienes alguna pregunta, no dudes en contactarnos.
    </p>
  `
  return emailLayout(content)
}

// Email de límite alcanzado
export function limitReachedEmail(name: string, plan: string, used: number, limit: number) {
  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 20px;">Límite de mensajes alcanzado</h2>
    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Hola ${name},
    </p>
    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Has alcanzado el límite de ${limit} mensajes de tu plan ${plan}. Para continuar usando From E, considera actualizar tu plan.
    </p>
    <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; color: ${colors.textSub}; font-size: 14px;">Uso actual:</p>
      <p style="margin: 0; color: ${colors.text}; font-size: 24px; font-weight: 600;">${used} / ${limit} mensajes</p>
    </div>
    ${button('Ver Planes', process.env.NEXT_PUBLIC_APP_URL + '/pricing' || 'http://localhost:3000/pricing')}
  `
  return emailLayout(content)
}

// Email de confirmación de pago
export function paymentConfirmationEmail(name: string, plan: string, amount: string) {
  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 20px;">Pago confirmado</h2>
    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Hola ${name},
    </p>
    <p style="margin: 0 0 24px 0; color: ${colors.textSub}; font-size: 16px; line-height: 1.6;">
      Tu pago ha sido procesado correctamente. Ya tienes acceso a todas las características del plan ${plan}.
    </p>
    <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0; color: ${colors.textSub}; font-size: 14px;">Plan:</td>
          <td align="right" style="padding: 8px 0; color: ${colors.text}; font-size: 14px; font-weight: 600;">${plan}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${colors.textSub}; font-size: 14px;">Monto:</td>
          <td align="right" style="padding: 8px 0; color: ${colors.text}; font-size: 14px; font-weight: 600;">${amount}</td>
        </tr>
      </table>
    </div>
    ${button('Ir a Mi Cuenta', process.env.NEXT_PUBLIC_APP_URL + '/account' || 'http://localhost:3000/account')}
    <p style="margin: 24px 0 0 0; color: ${colors.textSub}; font-size: 14px; line-height: 1.6;">
      Recibirás una factura por separado en los próximos minutos.
    </p>
  `
  return emailLayout(content)
}
