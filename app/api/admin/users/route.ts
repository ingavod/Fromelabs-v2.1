import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission, canManageUserRole, PERMISSIONS } from '@/types/roles'
import type { UserRole } from '@/types/roles'

// GET - Listar usuarios
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.role || !hasPermission(session.user.role as UserRole, PERMISSIONS.VIEW_USERS_LIST)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') as UserRole | null
    const plan = searchParams.get('plan') || ''

    const where: any = {}
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (role) where.role = role
    if (plan) where.plan = plan

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        isActive: true,
        isBlocked: true,
        messagesUsed: true,
        messagesLimit: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error al listar usuarios:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar usuario
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.role || !hasPermission(session.user.role as UserRole, PERMISSIONS.EDIT_USERS)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, updates } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    // Verificar que el usuario actual puede gestionar el rol objetivo
    if (updates.role) {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (!targetUser) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }

      if (!canManageUserRole(session.user.role as UserRole, updates.role as UserRole)) {
        return NextResponse.json(
          { error: 'No tienes permisos para asignar este rol' },
          { status: 403 }
        )
      }
    }

    // Actualizar isAdmin según el rol
    if (updates.role) {
      updates.isAdmin = ['ADMIN', 'SUPER', 'MODERATOR', 'OWNER'].includes(updates.role)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        isActive: true,
        isBlocked: true,
        messagesUsed: true,
        messagesLimit: true,
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar usuario
export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.role || !hasPermission(session.user.role as UserRole, PERMISSIONS.DELETE_USERS)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    // No permitir auto-eliminación
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    )
  }
}
