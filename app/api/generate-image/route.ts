import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const PLAN_LIMITS: Record<string, number> = {
  FREE: 10,
  PRO: 100,
  PREMIUM: 500,
  ENTERPRISE: 1000,
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

    const limit = PLAN_LIMITS[user.plan] || PLAN_LIMITS.FREE
    const imagesUsedThisMonth = user.imagesUsed || 0

    if (imagesUsedThisMonth >= limit) {
      return NextResponse.json(
        { error: `Has alcanzado tu límite de ${limit} imágenes del plan ${user.plan}. Actualiza tu plan para continuar.` },
        { status: 429 }
      )
    }

    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt requerido' }, { status: 400 })
    }

    // Llamar a Hugging Face API - FLUX.1-schnell (rápido y gratis)
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt.trim() }),
      }
    )

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text()
      console.error('Hugging Face API error:', errorText)
      throw new Error('Error generando imagen con Hugging Face')
    }

    // Convertir la respuesta a base64 para mostrarla en el frontend
    const imageBlob = await hfResponse.blob()
    const imageBuffer = await imageBlob.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const imageUrl = `data:image/png;base64,${base64Image}`

    await prisma.user.update({
      where: { id: user.id },
      data: { imagesUsed: imagesUsedThisMonth + 1 },
    })

    return NextResponse.json({
      imageUrl,
      prompt,
      usage: {
        used: imagesUsedThisMonth + 1,
        limit,
        plan: user.plan,
      },
    })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json({ error: 'Error al generar imagen' }, { status: 500 })
  }
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

    const limit = PLAN_LIMITS[user.plan] || PLAN_LIMITS.FREE

    return NextResponse.json({
      usage: {
        used: user.imagesUsed || 0,
        limit,
        plan: user.plan,
      },
    })
  } catch (error) {
    console.error('Error getting image usage:', error)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
