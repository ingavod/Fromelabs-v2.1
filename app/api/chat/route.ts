import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'
import { checkUserUsage, sendUsageAlert } from '@/lib/usage-alerts'
import MemoryService from '@/src/services/memoryService'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const PLAN_LIMITS: Record<string, number> = {
  FREE: 10,
  BETA: 2500,
  PRO: 500,
  PREMIUM: 1200,
  ENTERPRISE: 4500,
}

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    if (action === 'usage') {
      return NextResponse.json({
        usage: {
          used: user.messagesUsed || 0,
          limit: user.messagesLimit || PLAN_LIMITS[user.plan] || PLAN_LIMITS.FREE,
          plan: user.plan || 'FREE',
        },
      })
    }

    if (action === 'projects') {
      const projects = await prisma.project.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { conversations: true },
          },
        },
      })
      return NextResponse.json({ projects })
    }

    if (action === 'conversations') {
      const projectId = searchParams.get('projectId')
      const search = searchParams.get('search')

      const where: any = { userId: user.id }

      if (projectId && projectId !== 'all') {
        where.projectId = projectId
      }

      if (search) {
        where.title = {
          contains: search,
          mode: 'insensitive',
        }
      }

      const conversations = await prisma.conversation.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: 50,
        select: {
          id: true,
          title: true,
          projectId: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      return NextResponse.json({ conversations })
    }

    if (action === 'messages') {
      const conversationId = searchParams.get('conversationId')
      if (!conversationId) {
        return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 })
      }

      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        select: {
          role: true,
          content: true,
        },
      })
      return NextResponse.json({ messages })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('GET /api/chat error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()
    const { action } = body

    if (action === 'createProject') {
      const { name } = body
      const project = await prisma.project.create({
        data: { name, userId: user.id },
      })
      return NextResponse.json({ project })
    }

    if (action === 'deleteProject') {
      const { projectId } = body
      await prisma.project.delete({ where: { id: projectId } })
      return NextResponse.json({ success: true })
    }

    if (action === 'deleteConversation') {
      const { conversationId } = body
      await prisma.conversation.delete({ where: { id: conversationId } })
      return NextResponse.json({ success: true })
    }

    if (action === 'renameConversation') {
      const { conversationId, title } = body
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { title },
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'sendMessage') {
      const { messages, conversationId, projectId, image, document } = body

      if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
      }

      // Leer límite: primero de la BD (Stripe lo actualiza), luego fallback a PLAN_LIMITS
      const limit = user.messagesLimit || PLAN_LIMITS[user.plan] || PLAN_LIMITS.FREE
      if (user.messagesUsed >= limit) {
        return NextResponse.json(
          { error: `Has alcanzado tu límite de ${limit} mensajes del plan ${user.plan}. Actualiza tu plan para continuar.` },
          { status: 429 }
        )
      }

      // Prepare messages for Claude - clean up to only keep role and content
      let apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      let lastContent = messages[messages.length - 1].content

      // Handle image attachment
      if (image?.data) {
        const base64Data = image.data.split(',')[1]
        apiMessages[apiMessages.length - 1] = {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: image.type,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: lastContent,
            },
          ],
        }
      }

      // Handle document attachment
      if (document?.content) {
        lastContent = `[Documento: ${document.name}]\n\n${document.content}\n\n---\n\n${lastContent}`
        apiMessages[apiMessages.length - 1] = {
          role: 'user',
          content: lastContent,
        }
      }

      // Stream response from Claude Sonnet 4.5
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          let fullResponse = ''
          let inputTokens = 0
          let outputTokens = 0

          try {
            console.log('🤖 Calling Claude Sonnet 4.5...')

            // Retry logic para manejar overload de Anthropic API
            let messageStream
            const maxRetries = 3
            let retryCount = 0
            
            // MEMORIA: Construir contexto del usuario
            const memoryService = new MemoryService()
            const userContext = await memoryService.buildContextForClaude(user.id)
            
            // MEMORIA: Extraer información del mensaje actual
            const userMessage = typeof messages[messages.length - 1].content === 'string'
              ? messages[messages.length - 1].content
              : lastContent
            await memoryService.extractAndSaveFromMessage(user.id, userMessage, conversationId)

            while (retryCount < maxRetries) {
              try {
                messageStream = await anthropic.messages.stream({
                  model: 'claude-sonnet-4-20250514',
                  max_tokens: 8192,
                  system: userContext || undefined, // Añadir contexto de memoria
                  messages: apiMessages,
                })

                break // Éxito, salir del loop de retry
              } catch (error: any) {
                const isOverloaded = error?.error?.type === 'overloaded_error' || 
                                    error?.message?.includes('Overloaded') ||
                                    error?.message?.includes('overloaded')
                
                if (isOverloaded && retryCount < maxRetries - 1) {
                  retryCount++
                  const waitTime = 1000 * Math.pow(2, retryCount) // Espera exponencial: 2s, 4s, 8s
                  console.log(`⚠️ API overloaded, retrying ${retryCount}/${maxRetries} in ${waitTime/1000}s...`)
                  await new Promise(resolve => setTimeout(resolve, waitTime))
                } else {
                  // Error diferente o último intento, lanzar error
                  throw error
                }
              }
            }

            if (!messageStream) {
              throw new Error('Failed to create message stream after retries')
            }

            for await (const event of messageStream) {
              if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                const text = event.delta.text
                fullResponse += text
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
              }

              if (event.type === 'message_start' && event.message.usage) {
                inputTokens = event.message.usage.input_tokens
              }

              if (event.type === 'message_delta' && event.usage) {
                outputTokens = event.usage.output_tokens
              }
            }

            console.log('✅ Claude response completed')
            console.log(`📊 Tokens - Input: ${inputTokens}, Output: ${outputTokens}`)

            // Create or get conversation
            let conversation
            if (conversationId) {
              conversation = await prisma.conversation.findUnique({ where: { id: conversationId } })
            }

            if (!conversation) {
              const firstMsg = messages.find((m: any) => m.role === 'user')
              const title = firstMsg?.content?.substring(0, 50) || 'Nueva conversación'
              conversation = await prisma.conversation.create({
                data: { userId: user.id, title, projectId: projectId || null },
              })
            }

            // Save user message
            await prisma.message.create({
              data: {
                conversationId: conversation.id,
                role: 'user',
                content: typeof messages[messages.length - 1].content === 'string'
                  ? messages[messages.length - 1].content
                  : lastContent,
                tokensUsed: inputTokens,
              },
            })

            // Save assistant message
            await prisma.message.create({
              data: {
                conversationId: conversation.id,
                role: 'assistant',
                content: fullResponse,
                tokensUsed: outputTokens,
              },
            })

            // Update user usage
            await prisma.user.update({
              where: { id: user.id },
              data: {
                messagesUsed: user.messagesUsed + 1,
                tokensUsed: user.tokensUsed + inputTokens + outputTokens,
              },
            })

            // Check if user needs usage alert
            try {
              const alert = await checkUserUsage(user.id)
              if (alert) {
                // Send alert email asynchronously (don't wait)
                sendUsageAlert(alert).catch(err =>
                  console.error('Error sending usage alert:', err)
                )
              }
            } catch (alertError) {
              console.error('Error checking usage alert:', alertError)
              // Don't fail the request if alert fails
            }

            // Update conversation timestamp
            await prisma.conversation.update({
              where: { id: conversation.id },
              data: { updatedAt: new Date() },
            })

            // Send completion event
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  conversationId: conversation.id,
                  usage: {
                    used: user.messagesUsed + 1,
                    limit,
                    plan: user.plan,
                  },
                })}\n\n`
              )
            )

          } catch (error: any) {
            console.error('❌ Claude API error:', error)
            const errorMessage = error?.error?.message || error?.message || 'Error al generar respuesta'
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
            )
          } finally {
            controller.close()
          }
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'X-Accel-Buffering':'no',
        },
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('POST /api/chat error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
