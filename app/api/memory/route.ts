import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import MemoryService from '@/src/services/memoryService'

const memoryService = new MemoryService()

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    if (key) {
      const memory = await memoryService.getMemory(session.user.id, key)
      return NextResponse.json({ memory })
    }

    if (search) {
      const memories = await memoryService.searchMemory(session.user.id, search)
      return NextResponse.json({ memories })
    }

    const memories = await memoryService.getAllMemories(session.user.id, type || undefined)
    return NextResponse.json({ memories })
  } catch (error) {
    console.error('Error al obtener memoria:', error)
    return NextResponse.json({ error: 'Error al obtener memoria' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const { key, value, type, confidence, expiresAt, metadata } = body

    if (!key || !value) {
      return NextResponse.json({ error: 'key y value son requeridos' }, { status: 400 })
    }

    await memoryService.saveMemory({
      userId: session.user.id,
      memoryKey: key,
      memoryValue: value,
      memoryType: type,
      confidence,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      metadata
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al guardar memoria:', error)
    return NextResponse.json({ error: 'Error al guardar memoria' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: 'key es requerida' }, { status: 400 })
    }

    const deleted = await memoryService.deleteMemory(session.user.id, key)
    return NextResponse.json({ 
      success: deleted,
      message: deleted ? 'Memoria eliminada' : 'Memoria no encontrada'
    })
  } catch (error) {
    console.error('Error al eliminar memoria:', error)
    return NextResponse.json({ error: 'Error al eliminar memoria' }, { status: 500 })
  }
}
