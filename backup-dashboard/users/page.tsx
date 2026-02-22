'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string | null
  plan: string
  isActive: boolean
  isAdmin: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Error al cargar usuarios')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.user && (session.user as any).isAdmin) {
      fetchUsers()
    }
  }, [session, fetchUsers])

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    
    if (filter === 'all') return matchesSearch
    if (filter === 'free') return matchesSearch && user.plan === 'free'
    if (filter === 'premium') return matchesSearch && user.plan === 'premium'
    if (filter === 'inactive') return matchesSearch && !user.isActive
    return matchesSearch
  })

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`¿Confirmar ${currentStatus ? 'desactivar' : 'activar'} usuario?`)) return
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus })
      })
      
      if (!res.ok) throw new Error('Error al actualizar usuario')
      
      await fetchUsers()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el usuario')
    }
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`¿Confirmar ${currentStatus ? 'quitar' : 'dar'} permisos de admin?`)) return
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isAdmin: !currentStatus })
      })
      
      if (!res.ok) throw new Error('Error al actualizar usuario')
      
      await fetchUsers()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el usuario')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('¿ELIMINAR este usuario permanentemente?')) return
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      if (!res.ok) throw new Error('Error al eliminar usuario')
      
      await fetchUsers()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el usuario')
    }
  }

  if (status === 'loading' || !session?.user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.25rem' }}>Cargando...</div>
      </div>
    )
  }

  if (!(session.user as any).isAdmin) {
    return null
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
              Gestión de Usuarios
            </h1>
            <button
              onClick={() => router.push('/admin')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: '#6366f1',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#4f46e5'}
              onMouseOut={(e) => e.currentTarget.style.background = '#6366f1'}
            >
              ← Volver al Dashboard
            </button>
          </div>

          {/* Filtros */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            
            {['all', 'free', 'premium', 'inactive'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: filter === f ? '2px solid #6366f1' : '2px solid #e5e7eb',
                  background: filter === f ? '#eff6ff' : 'white',
                  color: filter === f ? '#6366f1' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: filter === f ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                {f === 'all' && 'Todos'}
                {f === 'free' && 'Free'}
                {f === 'premium' && 'Premium'}
                {f === 'inactive' && 'Inactivos'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Usuarios</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.5rem' }}>
              {users.length}
            </div>
          </div>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Plan Free</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.5rem' }}>
              {users.filter(u => u.plan === 'free').length}
            </div>
          </div>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Plan Premium</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>
              {users.filter(u => u.plan === 'premium').length}
            </div>
          </div>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Inactivos</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginTop: '0.5rem' }}>
              {users.filter(u => !u.isActive).length}
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              Cargando usuarios...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              No se encontraron usuarios
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Nombre</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Plan</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Estado</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Admin</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{user.name || '-'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: user.plan === 'premium' ? '#dcfce7' : '#f3f4f6',
                          color: user.plan === 'premium' ? '#166534' : '#6b7280'
                        }}>
                          {user.plan.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: user.isActive ? '#dcfce7' : '#fee2e2',
                          color: user.isActive ? '#166534' : '#991b1b'
                        }}>
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {user.isAdmin ? '✓' : '✗'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleToggleActive(user.id, user.isActive)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              border: 'none',
                              background: user.isActive ? '#fef3c7' : '#d1fae5',
                              color: user.isActive ? '#92400e' : '#065f46',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              transition: 'all 0.2s'
                            }}
                          >
                            {user.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                          
                          <button
                            onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#dbeafe',
                              color: '#1e40af',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              transition: 'all 0.2s'
                            }}
                          >
                            {user.isAdmin ? 'Quitar Admin' : 'Hacer Admin'}
                          </button>
                          
                          <button
                            onClick={() => handleDelete(user.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#fee2e2',
                              color: '#991b1b',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              transition: 'all 0.2s'
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
