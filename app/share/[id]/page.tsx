'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

// Colores del tema
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surface2: '#1a1a1a',
  surface3: '#242424',
  border: '#2a2a2a',
  navy: '#1e40af',
  navyBord: '#2563eb',
  navyText: '#60a5fa',
  text: '#e5e5e5',
  textSub: '#a3a3a3',
  textMuted: '#737373',
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface SharedConversation {
  title: string
  messages: Message[]
  createdAt: string
}

export default function SharedConversationPage() {
  const params = useParams()
  const conversationId = params.id as string
  
  const [conversation, setConversation] = useState<SharedConversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadConversation()
  }, [conversationId])

  const loadConversation = async () => {
    try {
      const res = await fetch(`/api/share/${conversationId}`)
      if (!res.ok) throw new Error('Conversación no encontrada')
      
      const data = await res.json()
      setConversation(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: C.textMuted
      }}>
        Cargando conversación...
      </div>
    )
  }

  if (error || !conversation) {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ef4444', marginBottom: '16px' }}>
            {error || 'Conversación no encontrada'}
          </div>
          <a href="/" style={{ color: C.navyText }}>
            Ir al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        background: C.surface2
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/logo-from-e.png" alt="Logo" width={32} height={32} />
            <div>
              <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                {conversation.title}
              </h1>
              <p style={{ margin: 0, fontSize: '0.75rem', color: C.textMuted }}>
                Compartido desde From E Labs
              </p>
            </div>
          </div>
          <a
            href="/"
            style={{
              padding: '8px 16px',
              background: C.navy,
              borderRadius: '6px',
              fontSize: '0.875rem',
              color: C.text,
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = C.navyBord}
            onMouseOut={(e) => e.currentTarget.style.background = C.navy}
          >
            Crear cuenta
          </a>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {conversation.messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {message.role === 'assistant' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  flexShrink: 0
                }}>
                  C
                </div>
              )}
              
              <div style={{
                maxWidth: '80%',
                borderRadius: '16px',
                padding: '12px 16px',
                background: message.role === 'user' ? C.navy : C.surface2,
                color: C.text,
                border: message.role === 'assistant' ? `1px solid ${C.border}` : 'none'
              }}>
                <div style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {message.content}
                </div>
              </div>

              {message.role === 'user' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #374151, #1f2937)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  flexShrink: 0
                }}>
                  U
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        background: C.surface2,
        marginTop: '48px'
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            color: C.textMuted,
            fontSize: '0.875rem',
            marginBottom: '12px'
          }}>
            Esta conversación fue creada con From E Labs
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: C.navy,
              borderRadius: '8px',
              fontWeight: '500',
              color: C.text,
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = C.navyBord}
            onMouseOut={(e) => e.currentTarget.style.background = C.navy}
          >
            Prueba From E Labs gratis
          </a>
        </div>
      </div>
    </div>
  )
}
