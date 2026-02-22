import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/types/roles'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || !hasPermission(session.user.role, 'canViewStats')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30D'

    const now = new Date()
    let startDate = new Date()
    
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

    // 1. Usuarios nuevos por día
    const newUsersByDay = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as count
      FROM "User"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

    // 2. Mensajes enviados por día
    const messagesByDay = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as count
      FROM "Message"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

    // 3. Distribución de planes
    const planDistribution = await prisma.user.groupBy({
      by: ['plan'],
      _count: { id: true }
    })

    // 4. Coste API
    const apiCost = await prisma.usage.aggregate({
      _sum: { cost: true, tokensUsed: true },
      _count: { id: true },
      where: { timestamp: { gte: startDate } }
    })

    // Estadísticas generales
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })
    const totalMessages = await prisma.message.count()
    const newUsersInRange = await prisma.user.count({
      where: { createdAt: { gte: startDate } }
    })
    const messagesInRange = await prisma.message.count({
      where: { createdAt: { gte: startDate } }
    })

    // Llenar gaps (días sin datos)
    const fillGaps = (data: Array<{ date: Date; count: bigint }>) => {
      const result: Array<{ date: string; value: number; label: string }> = []
      const currentDate = new Date(startDate)
      const endDate = new Date()
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const existing = data.find(d => {
          const itemDate = new Date(d.date)
          return itemDate.toISOString().split('T')[0] === dateStr
        })
        
        const date = new Date(dateStr)
        result.push({
          date: dateStr,
          value: existing ? Number(existing.count) : 0,
          label: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
        })
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      return result
    }

    // Formatear distribución de planes para PieChart
    const totalUsersForPlans = planDistribution.reduce((sum, p) => sum + p._count.id, 0)
    const planData = planDistribution.map(item => ({
      name: item.plan,
      value: item._count.id,
      percentage: totalUsersForPlans > 0 ? ((item._count.id / totalUsersForPlans) * 100).toFixed(1) : '0'
    }))

    return NextResponse.json({
      range,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      
      metrics: {
        totalUsers,
        activeUsers,
        totalMessages,
        newUsersInRange,
        messagesInRange,
        avgMessagesPerUser: totalUsers > 0 ? Math.round(totalMessages / totalUsers) : 0,
      },

      charts: {
        newUsersByDay: fillGaps(newUsersByDay),
        messagesByDay: fillGaps(messagesByDay),
        planDistribution: planData,
        apiCost: {
          total: apiCost._sum.cost || 0,
          totalTokens: apiCost._sum.tokensUsed || 0,
          totalRequests: apiCost._count.id || 0,
          avgCostPerRequest: apiCost._count.id > 0 ? (apiCost._sum.cost || 0) / apiCost._count.id : 0,
        },
      },
    })
  } catch (error) {
    console.error('Error en stats API:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
