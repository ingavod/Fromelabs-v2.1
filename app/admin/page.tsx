'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

// Colores del sistema
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surface2: '#1a1a1a',
  border: '#2a2a2a',
  navy: '#1e40af',
  navyBord: '#2563eb',
  text: '#e5e5e5',
  textSub: '#a3a3a3',
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: C.text }}>Cargando...</div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: C.text }}>No tienes permisos de administrador</div>
      </div>
    )
  }

  const adminSections = [
    {
      title: 'Estadísticas',
      description: 'Dashboard con métricas y gráficos del sistema',
      href: '/admin/estadisticas',
    },
    {
      title: 'Usuarios',
      description: 'Gestión de usuarios, planes y permisos',
      href: '/admin/usuarios',
    },
    {
      title: 'Roles y Permisos',
      description: 'Documentación del sistema de roles',
      href: '/admin/roles',
    },
    {
      title: 'Análisis Económico',
      description: 'Ingresos, costes y previsiones del sistema',
      href: '/admin/analisis-economico',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px 32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Image src="/logo-from-e.png" alt="From E Labs" width={48} height={48} />
              <div>
                <h1 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '700' }}>
                  Panel de Administración
                </h1>
                <p style={{ margin: 0, color: C.textSub, fontSize: '0.875rem' }}>
                  Bienvenido, {session.user.name}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => router.push('/chat')}
                style={{
                  padding: '8px 16px',
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: '8px',
                  color: C.text,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = C.border}
                onMouseOut={(e) => e.currentTarget.style.background = C.surface2}
              >
                Ir al Chat
              </button>
              <button
                onClick={() => router.push('/account')}
                style={{
                  padding: '8px 16px',
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: '8px',
                  color: C.text,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = C.border}
                onMouseOut={(e) => e.currentTarget.style.background = C.surface2}
              >
                Mi Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 32px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {adminSections.map((section) => (
            <button
              key={section.href}
              onClick={() => router.push(section.href)}
              style={{
                position: 'relative',
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = C.navy
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = C.border
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: C.text
              }}>
                {section.title}
              </h2>
              
              <p style={{
                margin: 0,
                color: C.textSub,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
                {section.description}
              </p>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div style={{
          marginTop: '48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{ color: C.textSub, fontSize: '0.875rem', marginBottom: '4px' }}>
              Tu rol
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              {session.user.role}
            </div>
          </div>
          
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{ color: C.textSub, fontSize: '0.875rem', marginBottom: '4px' }}>
              Plan actual
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              {session.user.plan}
            </div>
          </div>
          
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{ color: C.textSub, fontSize: '0.875rem', marginBottom: '4px' }}>
              Mensajes usados
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              {session.user.messagesUsed}
            </div>
          </div>
          
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{ color: C.textSub, fontSize: '0.875rem', marginBottom: '4px' }}>
              Límite
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              {session.user.messagesLimit}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
