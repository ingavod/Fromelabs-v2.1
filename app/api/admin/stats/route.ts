import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await auth()

    // Verificar que el usuario esté autenticado
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Obtener parámetros de rango
    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '30D'

    // Calcular fechas según el rango
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case '1D':
        startDate.setDate(now.getDate() - 1)
        break
      case '7D':
        startDate.setDate(now.getDate() - 7)
        break
      case '30D':
        startDate.setDate(now.getDate() - 30)
        break
      case '90D':
        startDate.setDate(now.getDate() - 90)
        break
      case '180D':
        startDate.setDate(now.getDate() - 180)
        break
      case '1A':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // MÉTRICAS PRINCIPALES
    
    // Total de usuarios
    const totalUsers = await prisma.user.count()

    // Usuarios activos (no bloqueados)
    const activeUsers = await prisma.user.count({
      where: { isActive: true, isBlocked: false },
    })

    // Usuarios bloqueados
    const blockedUsers = await prisma.user.count({
      where: { isBlocked: true },
    })

    // Administradores
    const adminUsers = await prisma.user.count({
      where: { isAdmin: true },
    })

    // Usuarios activos recientes (últimos 7 días)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(now.getDate() - 7)
    
    const recentlyActiveUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: sevenDaysAgo,
        },
      },
    })

    // Total de mensajes históricos
    const totalMessages = await prisma.message.count()

    // Total de conversaciones
    const totalConversations = await prisma.conversation.count()

    // Nuevos usuarios en el rango seleccionado
    const newUsersInRange = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Mensajes enviados en el rango seleccionado
    const messagesInRange = await prisma.message.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Promedio de mensajes por usuario
    const avgMessagesPerUser = totalUsers > 0 ? totalMessages / totalUsers : 0

    // Promedio de mensajes por conversación
    const avgMessagesPerConversation = totalConversations > 0 ? totalMessages / totalConversations : 0

    // Tasa de retención (usuarios que han vuelto en los últimos 7 días)
    const retentionRate = totalUsers > 0 ? Math.round((recentlyActiveUsers / totalUsers) * 100) : 0

    // GRÁFICAS

    // 1. Nuevos usuarios por día
    const newUsersByDay = await generateDailyData(
      startDate,
      now,
      async (start, end) => {
        return await prisma.user.count({
          where: {
            createdAt: {
              gte: start,
              lt: end,
            },
          },
        })
      }
    )

    // 2. Mensajes enviados por día
    const messagesByDay = await generateDailyData(
      startDate,
      now,
      async (start, end) => {
        return await prisma.message.count({
          where: {
            createdAt: {
              gte: start,
              lt: end,
            },
          },
        })
      }
    )

    // 3. Distribución de planes
    const planCounts = await prisma.user.groupBy({
      by: ['plan'],
      _count: true,
    })

    const planDistribution = planCounts.map((item) => {
      const percentage = totalUsers > 0 ? ((item._count / totalUsers) * 100).toFixed(1) : '0'
      return {
        name: item.plan,
        value: item._count,
        percentage,
      }
    })

    // 4. Coste API estimado
    const usageData = await prisma.usage.aggregate({
      _sum: {
        tokensUsed: true,
        cost: true,
      },
      _count: true,
      where: {
        timestamp: {
          gte: startDate,
        },
      },
    })

    const apiCost = {
      total: usageData._sum.cost || 0,
      totalTokens: usageData._sum.tokensUsed || 0,
      totalRequests: usageData._count || 0,
      avgCostPerRequest: usageData._count > 0 ? (usageData._sum.cost || 0) / usageData._count : 0,
    }

    // Respuesta final
    const stats = {
      range,
      metrics: {
        totalUsers,
        activeUsers,
        blockedUsers,
        adminUsers,
        recentlyActiveUsers,
        totalMessages,
        totalConversations,
        newUsersInRange,
        messagesInRange,
        avgMessagesPerUser: Number(avgMessagesPerUser.toFixed(2)),
        avgMessagesPerConversation: Number(avgMessagesPerConversation.toFixed(2)),
        retentionRate,
      },
      charts: {
        newUsersByDay,
        messagesByDay,
        planDistribution,
        apiCost,
      },
    }

    return NextResponse.json(stats)

  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Función helper para generar datos diarios
async function generateDailyData(
  startDate: Date,
  endDate: Date,
  countFn: (start: Date, end: Date) => Promise<number>
) {
  const data: Array<{ date: string; value: number; label: string }> = []
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // Limitar a máximo 90 puntos de datos para no saturar
  const step = daysDiff > 90 ? Math.ceil(daysDiff / 90) : 1

  for (let i = 0; i <= daysDiff; i += step) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    const nextDate = new Date(currentDate)
    nextDate.setDate(currentDate.getDate() + step)

    const count = await countFn(currentDate, nextDate)

    data.push({
      date: currentDate.toISOString().split('T')[0],
      value: count,
      label: formatDateLabel(currentDate, daysDiff),
    })
  }

  return data
}

// Función helper para formatear etiquetas de fecha
function formatDateLabel(date: Date, totalDays: number): string {
  if (totalDays <= 7) {
    // Para 7 días o menos, mostrar día de la semana
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
  } else if (totalDays <= 90) {
    // Para 90 días o menos, mostrar día/mes
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  } else {
    // Para más de 90 días, mostrar mes/año
    return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
  }
}
