import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Precios mensuales por plan
const PLAN_PRICES: Record<string, number> = {
  FREE: 0,
  PRO: 19.99,
  PREMIUM: 49.99,
  ENTERPRISE: 99.99,
}

// Coste estimado por token (Claude Sonnet 4.5)
// Input: $3 per million tokens = €2.85
// Output: $15 per million tokens = €14.25
// Promedio aproximado: €8.55 per million tokens
const COST_PER_MILLION_TOKENS = 8.55

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener todos los usuarios con sus planes
    const users = await prisma.user.findMany({
      select: {
        plan: true,
        tokensUsed: true,
        subscriptionStatus: true,
      },
    })

    // Calcular ingresos totales y por plan
    const planDistribution: Record<string, { count: number; monthlyRevenue: number; annualProjection: number }> = {
      FREE: { count: 0, monthlyRevenue: 0, annualProjection: 0 },
      PRO: { count: 0, monthlyRevenue: 0, annualProjection: 0 },
      PREMIUM: { count: 0, monthlyRevenue: 0, annualProjection: 0 },
      ENTERPRISE: { count: 0, monthlyRevenue: 0, annualProjection: 0 },
    }

    users.forEach(user => {
      const plan = user.plan || 'FREE'
      if (planDistribution[plan]) {
        planDistribution[plan].count++
        // Solo contar usuarios con suscripción activa
        if (user.subscriptionStatus === 'active' || plan === 'FREE') {
          const price = PLAN_PRICES[plan] || 0
          planDistribution[plan].monthlyRevenue += price
          planDistribution[plan].annualProjection += price * 12
        }
      }
    })

    // Ingresos mensuales recurrentes
    const monthlyRevenue = Object.values(planDistribution).reduce(
      (sum, p) => sum + p.monthlyRevenue,
      0
    )

    // Ingresos totales (para el ejemplo, asumimos 6 meses de operación)
    // En producción, esto vendría de un historial de pagos
    const totalRevenue = monthlyRevenue * 6

    // Calcular costes de API
    const totalTokens = users.reduce((sum, user) => sum + (user.tokensUsed || 0), 0)
    const estimatedCosts = (totalTokens / 1000000) * COST_PER_MILLION_TOKENS

    // Beneficio neto
    const profit = totalRevenue - estimatedCosts

    // Evolución de costes (últimos 7 días simulados)
    // En producción, esto vendría de un log de uso diario
    const today = new Date()
    const costEvolution = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (6 - i))
      // Simular coste creciente (en producción vendría de datos reales)
      const dailyCost = (estimatedCosts / 30) * (0.8 + Math.random() * 0.4)
      return {
        date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        cost: dailyCost,
      }
    })

    // Obtener umbral de alerta configurado (por defecto 100€)
    // En producción, esto estaría en una tabla de configuración
    const costThreshold = 100.0
    const isOverThreshold = estimatedCosts > costThreshold

    // Obtener pagos recientes (últimos 10)
    // En producción, esto vendría de una tabla de transacciones
    const recentPayments = await prisma.user.findMany({
      where: {
        subscriptionStatus: 'active',
        plan: {
          in: ['PRO', 'PREMIUM', 'ENTERPRISE'],
        },
      },
      select: {
        name: true,
        email: true,
        plan: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 10,
    })

    const formattedPayments = recentPayments.map(payment => ({
      date: payment.updatedAt.toLocaleDateString('es-ES'),
      user: payment.name || payment.email,
      plan: payment.plan,
      amount: PLAN_PRICES[payment.plan] || 0,
    }))

    return NextResponse.json({
      totalRevenue,
      monthlyRevenue,
      estimatedCosts,
      profit,
      costEvolution,
      costThreshold,
      isOverThreshold,
      planDistribution: Object.entries(planDistribution).map(([plan, data]) => ({
        plan,
        count: data.count,
        monthlyRevenue: data.monthlyRevenue,
        annualProjection: data.annualProjection,
      })),
      recentPayments: formattedPayments,
    })

  } catch (error: any) {
    console.error('Error fetching economic stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
