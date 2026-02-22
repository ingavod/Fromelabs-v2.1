import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            role: true,
            content: true,
            createdAt: true,
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      title: conversation.title,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
    })
  } catch (error) {
    console.error('Error loading shared conversation:', error)
    return NextResponse.json(
      { error: 'Error al cargar la conversación' },
      { status: 500 }
    )
  }
}
