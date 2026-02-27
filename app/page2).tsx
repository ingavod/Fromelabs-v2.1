'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Colores del tema
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surface2: '#1a1a1a',
  border: '#2a2a2a',
  navy: '#1e40af',
  navyBord: '#2563eb',
  text: '#e5e5e5',
  textSub: '#a3a3a3',
  textMuted: '#737373',
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const mainActions = [
    {
      title: 'Chat con IA',
      description: 'Conversa con From E',
      action: () => router.push(session ? '/chat' : '/login'),
      color: C.navy,
    },
    {
      title: 'Planes',
      description: 'Ver planes y precios',
      action: () => router.push('/pricing'),
      color: '#1e3a8a',
    },
    {
      title: session ? 'Mi Cuenta' : 'Iniciar Sesión',
      description: session ? 'Configuración y uso' : 'Accede a tu cuenta',
      action: () => router.push(session ? '/account' : '/login'),
      color: '#374151',
    },
  ]

  if (session?.user?.isAdmin) {
    mainActions.push({
      title: 'Administración',
      description: 'Panel de administrador',
      action: () => router.push('/admin'),
      color: '#1e3a5f',
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Header */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '20px 32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/logo-from-e.png" alt="Logo" width={36} height={36} />
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
              From E Labs
            </h1>
          </div>
          
          {session && (
            <div style={{ color: C.textSub, fontSize: '0.875rem' }}>
              Hola, {session.user.name || session.user.email}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 32px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            margin: '0 0 12px 0'
          }}>
            Bienvenido a From E Labs
          </h2>
          <p style={{
            color: C.textSub,
            fontSize: '1rem',
            margin: 0
          }}>
            Tu asistente de IA
          </p>
        </div>

        {/* Action Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          maxWidth: '800px',
          margin: '0 auto 48px'
        }}>
          {mainActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '32px 24px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = C.navyBord
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = C.border
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: action.color,
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: C.text
                }} />
              </div>

              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: C.text
              }}>
                {action.title}
              </h3>

              <p style={{
                fontSize: '0.875rem',
                color: C.textSub,
                margin: 0
              }}>
                {action.description}
              </p>
            </button>
          ))}
        </div>

        {/* CTA if not logged in */}
        {!session && status !== 'loading' && (
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            marginTop: '32px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              margin: '0 0 12px 0'
            }}>
              ¿Nuevo en From E Labs?
            </h3>
            <p style={{
              color: C.textSub,
              fontSize: '0.875rem',
              margin: '0 0 20px 0'
            }}>
              Crea una cuenta gratuita y comienza a usar IA ahora
            </p>
            <button
              onClick={() => router.push('/register')}
              style={{
                padding: '12px 32px',
                background: C.navy,
                border: 'none',
                borderRadius: '8px',
                color: C.text,
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = C.navyBord}
              onMouseOut={(e) => e.currentTarget.style.background = C.navy}
            >
              Crear Cuenta Gratis
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        padding: '24px 32px',
        marginTop: '64px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          color: C.textMuted,
          fontSize: '0.75rem'
        }}>
          © 2026 From E Labs. Todos los derechos reservados.
        </div>
      </div>
    </div>
  )
}
