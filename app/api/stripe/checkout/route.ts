import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const PLAN_PRICES = {
  PRO: {
    amount: 1999, // $19.99 en centavos
    name: 'Pro Plan',
    messages: 500,
  },
  PREMIUM: {
    amount: 4999, // $49.99 en centavos
    name: 'Premium Plan',
    messages: 2000,
  },
  ENTERPRISE: {
    amount: 9999, // $99.99 en centavos
    name: 'Enterprise Plan',
    messages: 10000,
  },
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { plan } = body

    if (!plan || !['PRO', 'PREMIUM', 'ENTERPRISE'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Obtener usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verificar que el usuario tenga datos de facturación
    if (!user.phone || !user.identification || !user.address || !user.city || !user.postalCode || !user.country) {
      return NextResponse.json(
        { error: 'Billing information is required before payment' },
        { status: 400 }
      )
    }

    const planDetails = PLAN_PRICES[plan as keyof typeof PLAN_PRICES]

    // Crear o recuperar customer de Stripe
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        phone: user.phone || undefined,
        address: {
          line1: user.address,
          city: user.city,
          postal_code: user.postalCode,
          country: getCountryCode(user.country),
        },
        metadata: {
          userId: user.id,
          identification: user.identification,
        },
      })
      customerId = customer.id

      // Guardar el customerId en la base de datos
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Crear sesión de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planDetails.name,
              description: `${planDetails.messages} mensajes mensuales con Claude Sonnet 4.5`,
            },
            unit_amount: planDetails.amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/canceled`,
      metadata: {
        userId: user.id,
        plan: plan,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Función helper para convertir nombre de país a código ISO
function getCountryCode(countryName: string): string {
  const countryMap: Record<string, string> = {
    'United States': 'US',
    'United Kingdom': 'GB',
    'Spain': 'ES',
    'France': 'FR',
    'Germany': 'DE',
    'Italy': 'IT',
    'Canada': 'CA',
    'Mexico': 'MX',
    'Brazil': 'BR',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'Ecuador': 'EC',
    'Bolivia': 'BO',
    'Uruguay': 'UY',
    'Paraguay': 'PY',
    'Costa Rica': 'CR',
    'Panama': 'PA',
    'Guatemala': 'GT',
    'Honduras': 'HN',
    'Nicaragua': 'NI',
    'El Salvador': 'SV',
    'Dominican Republic': 'DO',
    'Cuba': 'CU',
    'Puerto Rico': 'PR',
    'Jamaica': 'JM',
    'Haiti': 'HT',
    'Portugal': 'PT',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Switzerland': 'CH',
    'Austria': 'AT',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Poland': 'PL',
    'Czech Republic': 'CZ',
    'Hungary': 'HU',
    'Romania': 'RO',
    'Greece': 'GR',
    'Turkey': 'TR',
    'Russia': 'RU',
    'Ukraine': 'UA',
    'Japan': 'JP',
    'China': 'CN',
    'South Korea': 'KR',
    'India': 'IN',
    'Australia': 'AU',
    'New Zealand': 'NZ',
    'Singapore': 'SG',
    'Thailand': 'TH',
    'Vietnam': 'VN',
    'Philippines': 'PH',
    'Indonesia': 'ID',
    'Malaysia': 'MY',
    'South Africa': 'ZA',
    'Egypt': 'EG',
    'Nigeria': 'NG',
    'Kenya': 'KE',
    'Morocco': 'MA',
    'Israel': 'IL',
    'Saudi Arabia': 'SA',
    'United Arab Emirates': 'AE',
  }
  
  return countryMap[countryName] || 'US' // Default a US si no se encuentra
}
