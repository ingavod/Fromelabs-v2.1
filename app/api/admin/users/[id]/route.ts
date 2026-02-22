import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const PLAN_LIMITS: Record<string, number> = {
  FREE: 50,
  BETA: 2500,      // Usuarios beta con 2500 mensajes gratis
  PRO: 500,
  PREMIUM: 2000,
  ENTERPRISE: 10000,
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params para Next.js 15
    const params = await context.params;
    
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!admin?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { name, role, plan, isActive, isBlocked } = body

    // Lógica especial para rol BETA
    let finalPlan = plan
    let finalMessagesLimit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || 50

    // Si se asigna rol BETA, forzar plan BETA y 2500 mensajes
    if (role === 'BETA') {
      finalPlan = 'BETA'
      finalMessagesLimit = 2500
    }
    
    // Si se cambia DE BETA a USER, ajustar a plan FREE
    const currentUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true },
    })
    
    if (currentUser?.role === 'BETA' && role === 'USER') {
      finalPlan = 'FREE'
      finalMessagesLimit = 50
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        role,
        plan: finalPlan,
        messagesLimit: finalMessagesLimit,
        isActive,
        isBlocked,
        isAdmin: role === 'ADMIN' || role === 'SUPER' || role === 'MODERATOR',
      },
    })

    return NextResponse.json({ user: updatedUser })

  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params para Next.js 15
    const params = await context.params;
    
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!admin?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // No permitir que un admin se elimine a sí mismo
    if (admin.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
