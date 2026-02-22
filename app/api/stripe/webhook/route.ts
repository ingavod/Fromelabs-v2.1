import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { sendEmail } from '@/lib/email-config'
import { paymentConfirmationEmail } from '@/lib/email-templates'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')

    let event: Stripe.Event

    // Si estamos en desarrollo y no hay webhook secret, parseamos directamente
    if (!webhookSecret || webhookSecret === 'whsec_disabled_for_testing') {
      console.log('⚠️ Webhook verification disabled for testing')
      event = JSON.parse(body)
    } else {
      // Verificación normal de webhook para producción
      if (!signature) {
        return NextResponse.json(
          { error: 'No signature found' },
          { status: 400 }
        )
      }

      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json(
          { error: `Webhook Error: ${err.message}` },
          { status: 400 }
        )
      }
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan

  if (!userId || !plan) {
    console.error('Missing userId or plan in session metadata')
    return
  }

  const subscriptionId = session.subscription as string

  // Obtener detalles de la suscripción
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Determinar límite de mensajes según el plan
  const messagesLimit = {
    PRO: 500,
    PREMIUM: 2000,
    ENTERPRISE: 10000,
  }[plan] || 50

  // Actualizar usuario en la base de datos
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      plan: plan,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: subscription.status,
      messagesLimit: messagesLimit,
      messagesUsed: 0, // Resetear mensajes al cambiar de plan
    },
  })

  // Enviar email de confirmación
  try {
    const amount = session.amount_total ? `€${(session.amount_total / 100).toFixed(2)}` : '€0.00'
    await sendEmail({
      to: user.email,
      subject: 'Pago confirmado - From E Labs',
      html: paymentConfirmationEmail(user.name || 'Usuario', plan, amount),
    })
    console.log(`📧 Payment confirmation email sent to ${user.email}`)
  } catch (emailError) {
    console.error('Error sending payment confirmation email:', emailError)
    // No fallar el webhook si falla el email
  }

  console.log(`✅ User ${userId} upgraded to ${plan} plan`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const user = await prisma.user.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!user) {
    console.error('User not found for subscription:', subscription.id)
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: subscription.status,
    },
  })

  console.log(`✅ Subscription ${subscription.id} updated to status: ${subscription.status}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!user) {
    console.error('User not found for subscription:', subscription.id)
    return
  }

  // Downgrade a plan FREE
  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: 'FREE',
      subscriptionStatus: 'INACTIVE',
      messagesLimit: 50,
      messagesUsed: 0,
    },
  })

  console.log(`✅ User ${user.id} downgraded to FREE plan (subscription canceled)`)
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) return

  const user = await prisma.user.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (!user) {
    console.error('User not found for subscription:', subscriptionId)
    return
  }

  // Resetear el contador de mensajes al inicio de cada período de facturación
  await prisma.user.update({
    where: { id: user.id },
    data: {
      messagesUsed: 0,
      subscriptionStatus: 'active',
    },
  })

  console.log(`✅ Invoice paid for user ${user.id}, messages reset`)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) return

  const user = await prisma.user.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (!user) {
    console.error('User not found for subscription:', subscriptionId)
    return
  }

  // Marcar como pago fallido
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'past_due',
    },
  })

  console.log(`⚠️ Payment failed for user ${user.id}`)
}
