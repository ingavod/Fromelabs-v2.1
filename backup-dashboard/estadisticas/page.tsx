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

interface Stats {
  totalUsers: number
  activeUsers: number
  premiumUsers: number
  totalRevenue: number
  newUsersToday: number
  activeNow: number
}

export default function EstadisticasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<Stats | null>(null)
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
        if (!res.ok) throw new Error('Error')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error(error)
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: C.surface, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: C.text, margin: 0 }}>Estadísticas Detalladas</h1>
            <button
              onClick={() => router.push('/admin')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: C.navy,
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              ← Volver al Dashboard
            </button>
          </div>

          <div style={{ padding: '32px' }}>
            {loading ? (
              <div style={{ textAlign: 'center' as const, color: C.textMuted, padding: '80px 0', fontSize: '0.9rem' }}>
                Cargando estadísticas...
              </div>
            ) : data && (
              <>
                {/* Summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  {[
                    { label: 'Total de Usuarios', value: data.totalUsers, color: C.navy, desc: 'Usuarios registrados' },
                    { label: 'Usuarios Activos', value: data.activeUsers, color: '#059669', desc: 'Con cuenta activa' },
                    { label: 'Usuarios Premium', value: data.premiumUsers, color: '#7c3aed', desc: 'Con plan premium' },
                    { label: 'Nuevos Hoy', value: data.newUsersToday, color: '#dc2626', desc: 'Registrados hoy' },
                    { label: 'Activos Ahora', value: data.activeNow, color: '#ea580c', desc: 'Conectados' },
                    { label: 'Ingresos Totales', value: `$${data.totalRevenue}`, color: '#0891b2', desc: 'Revenue total' }
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        background: C.surface2,
                        border: `1px solid ${C.border}`,
                        borderRadius: '12px',
                        padding: '24px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', color: C.textSub, marginBottom: '8px', fontWeight: '500' }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: '2.5rem', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: C.textMuted }}>
                        {stat.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional info */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '24px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: C.text, marginBottom: '16px' }}>
                    Métricas Clave
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '0.9rem', color: C.textSub, marginBottom: '8px' }}>Tasa de conversión</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '600', color: C.text }}>
                        {data.totalUsers > 0 ? ((data.premiumUsers / data.totalUsers) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '0.9rem', color: C.textSub, marginBottom: '8px' }}>Tasa de activación</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '600', color: C.text }}>
                        {data.totalUsers > 0 ? ((data.activeUsers / data.totalUsers) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '0.9rem', color: C.textSub, marginBottom: '8px' }}>Ingreso por usuario</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '600', color: C.text }}>
                        ${data.totalUsers > 0 ? (data.totalRevenue / data.totalUsers).toFixed(2) : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
