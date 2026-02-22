'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const C = {
  navy: '#1e3a8a',
  navySoft: '#dbeafe',
  navyBord: '#93c5fd',
  navyText: '#1e40af',
  surface: '#ffffff',
  surface2: '#f9fafb',
  border: '#e5e7eb',
  text: '#111827',
  textSub: '#6b7280',
  textMuted: '#9ca3af'
}

interface DashboardData {
  totalUsers: number
  activeUsers: number
  premiumUsers: number
  totalRevenue: number
  newUsersToday: number
  activeNow: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.push('/login')
      return
    }
    if (!(session.user as any).isAdmin) {
      router.push('/')
      return
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) throw new Error('Error al cargar estadísticas')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user && (session.user as any).isAdmin) {
      fetchData()
    }
  }, [session])

  if (status === 'loading' || !session?.user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ color: 'white', fontSize: '1.25rem' }}>Cargando...</div>
      </div>
    )
  }

  if (!(session.user as any).isAdmin) {
    return null
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', active: true },
    { label: 'Usuarios', href: '/admin/users', active: false },
    { label: 'Estadísticas', href: '/admin/estadisticas', active: false }
  ]

  const quickActions = [
    { label: 'Ver Usuarios', href: '/admin/users' },
    { label: 'Ver Estadísticas', href: '/admin/estadisticas' },
    { label: 'Volver al Inicio', href: '/' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: C.text, margin: 0 }}>Panel Admin</h2>
        </div>
        
        <div style={{ padding: '16px 12px', flex: 1 }}>
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                marginBottom: '4px',
                borderLeft: `2px solid ${item.active ? C.navy : 'transparent'}`,
                background: item.active ? C.navySoft : 'transparent',
                color: item.active ? C.navyText : C.textSub,
                cursor: 'pointer',
                fontSize: '0.875rem',
                textAlign: 'left' as const,
                fontWeight: item.active ? '500' : '400',
                transition: 'all 0.15s',
                width: '100%'
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div style={{ padding: '16px', borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={() => router.push('/')}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: C.textMuted,
              cursor: 'pointer',
              fontSize: '0.82rem',
              textAlign: 'left' as const,
              transition: 'all 0.15s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = C.surface2
              e.currentTarget.style.color = C.text
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = C.textMuted
            }}
          >
            ← Salir del panel
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: C.surface, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.border}` }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: C.text, margin: 0 }}>Dashboard Administrativo</h1>
              <p style={{ color: C.textSub, fontSize: '0.875rem', marginTop: '4px', marginBottom: 0 }}>
                Bienvenido, {session.user.email}
              </p>
            </div>

            <div style={{ padding: '28px 32px', flex: 1 }}>
              {loading ? (
                <div style={{ color: C.textMuted, fontSize: '0.875rem', paddingTop: '60px', textAlign: 'center' as const }}>
                  Cargando estadísticas...
                </div>
              ) : !data ? (
                <div style={{ color: C.textMuted, fontSize: '0.875rem', paddingTop: '60px', textAlign: 'center' as const }}>
                  Error al cargar los datos
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                    {[
                      { label: 'Total Usuarios', value: data.totalUsers, color: C.navy },
                      { label: 'Usuarios Activos', value: data.activeUsers, color: '#059669' },
                      { label: 'Plan Premium', value: data.premiumUsers, color: '#7c3aed' },
                      { label: 'Nuevos Hoy', value: data.newUsersToday, color: '#dc2626' }
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        style={{
                          background: C.surface2,
                          border: `1px solid ${C.border}`,
                          borderRadius: '10px',
                          padding: '18px 16px'
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', color: C.textSub, marginBottom: '6px' }}>{stat.label}</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '24px', marginTop: '12px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: C.text, marginBottom: '16px', marginTop: 0 }}>
                      Acciones Rápidas
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {quickActions.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => router.push(item.href)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 13px',
                            borderRadius: '8px',
                            border: `1px solid ${C.border}`,
                            background: 'transparent',
                            color: C.text,
                            cursor: 'pointer',
                            fontSize: '0.855rem',
                            textAlign: 'left' as const,
                            transition: 'all 0.15s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = C.navySoft
                            e.currentTarget.style.borderColor = C.navyBord
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.borderColor = C.border
                          }}
                        >
                          {item.label}
                          <span style={{ marginLeft: '8px' }}>→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
