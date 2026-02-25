'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surface2: '#1a1a1a',
  surface3: '#242424',
  border: '#2a2a2a',
  navy: '#1e40af',
  navySoft: '#1e3a5f',
  navyBord: '#2563eb',
  navyText: '#60a5fa',
  text: '#e5e5e5',
  textSub: '#a3a3a3',
  textMuted: '#737373',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
}

interface User {
  id: string
  email: string
  name: string | null
  plan: string
  isActive: boolean
  isAdmin: boolean
  createdAt: string
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user && !(session.user as any).isAdmin) {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchUsers()
    }
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !currentStatus })
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error toggling admin status:', error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (status === 'loading' || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: C.textMuted,
        fontSize: '0.9rem'
      }}>
        Cargando usuarios...
      </div>
    )
  }

  if (!session?.user || !(session.user as any).isAdmin) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Header */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '20px 32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 4px 0' }}>
              Gestión de Usuarios
            </h1>
            <p style={{ color: C.textMuted, fontSize: '0.875rem', margin: 0 }}>
              {users.length} usuarios totales
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: `1px solid ${C.border}`,
              background: C.surface2,
              color: C.text,
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = C.surface3
              e.currentTarget.style.borderColor = C.navyBord
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = C.surface2
              e.currentTarget.style.borderColor = C.border
            }}
          >
            Volver al Chat
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '0 32px'
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { label: 'Overview', href: '/admin', active: false },
            { label: 'Usuarios', href: '/admin/users', active: true },
            { label: 'Estadísticas', href: '/admin/estadisticas', active: false }
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => router.push(tab.href)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: 'transparent',
                color: tab.active ? C.navyText : C.textSub,
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: tab.active ? '500' : '400',
                borderBottom: tab.active ? `2px solid ${C.navy}` : '2px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!tab.active) {
                  e.currentTarget.style.color = C.text
                }
              }}
              onMouseOut={(e) => {
                if (!tab.active) {
                  e.currentTarget.style.color = C.textSub
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Buscar por email o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '10px 16px',
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '8px',
              color: C.text,
              fontSize: '0.875rem',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = C.navyBord
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = C.border
            }}
          />
        </div>

        {/* Users Table */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: C.textMuted
            }}>
              Cargando usuarios...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: C.textMuted
            }}>
              No se encontraron usuarios
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: C.textSub
                  }}>
                    Email
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: C.textSub
                  }}>
                    Nombre
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: C.textSub
                  }}>
                    Plan
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: C.textSub
                  }}>
                    Estado
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: C.textSub
                  }}>
                    Admin
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: C.textSub
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      transition: 'background 0.15s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = C.surface2
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>
                      {user.name || '-'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: user.plan === 'premium' ? `${C.warning}20` : `${C.navyText}20`,
                        color: user.plan === 'premium' ? C.warning : C.navyText,
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }}>
                        {user.plan}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: user.isActive ? `${C.success}20` : `${C.danger}20`,
                        color: user.isActive ? C.success : C.danger,
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontSize: '1.2rem'
                    }}>
                      {user.isAdmin ? '✓' : '✗'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: `1px solid ${C.border}`,
                            background: C.surface2,
                            color: C.text,
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            transition: 'all 0.15s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = C.surface3
                            e.currentTarget.style.borderColor = C.navyBord
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = C.surface2
                            e.currentTarget.style.borderColor = C.border
                          }}
                        >
                          {user.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: `1px solid ${C.border}`,
                            background: C.surface2,
                            color: C.text,
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            transition: 'all 0.15s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = C.surface3
                            e.currentTarget.style.borderColor = C.warning
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = C.surface2
                            e.currentTarget.style.borderColor = C.border
                          }}
                        >
                          {user.isAdmin ? 'Quitar Admin' : 'Hacer Admin'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
