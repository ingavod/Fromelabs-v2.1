import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'From E Labs <noreply@fromelabs.com>',
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error('❌ Error enviando email con Resend:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email enviado con Resend:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('❌ Error enviando email con Resend:', error);
    return { success: false, error: error.message };
  }
}

export async function verifyEmailConnection() {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY no configurada');
      return false;
    }
    console.log('✅ Resend configurado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error verificando Resend:', error);
    return false;
  }
}

export const transporter = {
  verify: async () => verifyEmailConnection(),
  sendMail: async (options: any) => sendEmail(options)
};
