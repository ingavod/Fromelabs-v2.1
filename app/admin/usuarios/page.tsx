'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  isAdmin: boolean
  isActive: boolean
  isBlocked: boolean
  plan: string
  messagesUsed: number
  messagesLimit: number
  createdAt: string
  lastLoginAt: string | null
}

const PLAN_LIMITS: Record<string, number> = {
  FREE: 10,
  BETA: 2500,
  PRO: 500,
  PREMIUM: 1200,
  ENTERPRISE: 4500,
}

const ROLE_HIERARCHY: Record<string, number> = {
  USER: 0,
  BETA: 0,
  MODERATOR: 1,
  ADMIN: 2,
  SUPER: 3,
  OWNER: 4,
}

export default function UsersManagementPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('ALL')
  const [filterPlan, setFilterPlan] = useState<string>('ALL')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState<string>('USER')

  useEffect(() => {
    loadUsers()
    loadCurrentUserRole()
  }, [])

  const loadCurrentUserRole = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      setCurrentUserRole(data?.user?.role || 'USER')
    } catch (error) {
      console.error('Error loading current user role:', error)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const canEditUser = (targetUser: User): boolean => {
    const currentLevel = ROLE_HIERARCHY[currentUserRole] || 0
    const targetLevel = ROLE_HIERARCHY[targetUser.role] || 0
    
    // OWNER puede editar a todos
    if (currentUserRole === 'OWNER') return true
    
    // SUPER NO puede editar a otros SUPER ni OWNER
    if (currentUserRole === 'SUPER' && (targetUser.role === 'SUPER' || targetUser.role === 'OWNER')) {
      return false
    }
    
    // Para otros roles, solo pueden editar a usuarios de nivel inferior
    return currentLevel > targetLevel
  }

  const canDeleteUser = (targetUser: User): boolean => {
    return canEditUser(targetUser)
  }

  const getAvailableRoles = (): string[] => {
    if (currentUserRole === 'OWNER') {
      return ['USER', 'BETA', 'MODERATOR', 'ADMIN', 'SUPER', 'OWNER']
    }
    
    if (currentUserRole === 'SUPER') {
      return ['USER', 'BETA', 'MODERATOR', 'ADMIN']
    }
    
    if (currentUserRole === 'ADMIN') {
      return ['USER', 'BETA', 'MODERATOR']
    }
    
    return ['USER', 'BETA']
  }

  const handleEdit = (user: User) => {
    if (!canEditUser(user)) {
      alert('No tienes permisos para editar este usuario')
      return
    }
    setEditingUser(user)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!editingUser) return

    if (!canEditUser(editingUser)) {
      alert('No tienes permisos para editar este usuario')
      return
    }

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingUser.name,
          role: editingUser.role,
          plan: editingUser.plan,
          isActive: editingUser.isActive,
          isBlocked: editingUser.isBlocked,
        }),
      })

      if (res.ok) {
        await loadUsers()
        setShowModal(false)
        setEditingUser(null)
      } else {
        const data = await res.json()
        alert(data.error || 'Error al actualizar usuario')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error al actualizar usuario')
    }
  }

  const handleDelete = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) return

    if (!canDeleteUser(user)) {
      alert('No tienes permisos para eliminar este usuario')
      return
    }

    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadUsers()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al eliminar usuario')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar usuario')
    }
  }

  const filteredUsers = users.filter(user => {
    if (user.role === 'OWNER') return false
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'ALL' || user.role === filterRole
    const matchesPlan = filterPlan === 'ALL' || user.plan === filterPlan
    return matchesSearch && matchesRole && matchesPlan
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Image src="/logo-from-e.png" alt="Frome Labs" width={32} height={32} />
            <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
          </div>
          <div className="text-gray-400">Cargando usuarios...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image src="/logo-from-e.png" alt="Frome Labs" width={40} height={40} />
            <div>
              <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
              <p className="text-sm text-gray-400">Tu rol: {currentUserRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Total: {filteredUsers.length} usuarios
            </div>
            <button
              onClick={() => window.location.href = '/admin'}
              className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 hover:bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por email o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">Todos los roles</option>
            <option value="USER">USER</option>
            <option value="BETA">BETA</option>
            <option value="MODERATOR">MODERATOR</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPER">SUPER</option>
            <option value="OWNER">OWNER</option>
          </select>

          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">Todos los planes</option>
            <option value="FREE">FREE</option>
            <option value="BETA">BETA</option>
            <option value="PRO">PRO</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f0f0f] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Rol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Mensajes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Último login</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => {
                  const canEdit = canEditUser(user)
                  const canDelete = canDeleteUser(user)
                  
                  return (
                    <tr key={user.id} className="hover:bg-[#1f1f1f] transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-white">{user.name || 'Sin nombre'}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded
                          ${user.role === 'OWNER' ? 'bg-purple-900/20 text-purple-400' :
                            user.role === 'ADMIN' || user.role === 'SUPER' ? 'bg-red-900/20 text-red-400' :
                            user.role === 'MODERATOR' ? 'bg-yellow-900/20 text-yellow-400' :
                            'bg-gray-800 text-gray-400'}
                        `}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded
                          ${user.plan === 'ENTERPRISE' ? 'bg-yellow-900/20 text-yellow-400' :
                            user.plan === 'PREMIUM' ? 'bg-purple-900/20 text-purple-400' :
                            user.plan === 'PRO' ? 'bg-blue-900/20 text-blue-400' :
                            user.plan === 'BETA' ? 'bg-green-900/20 text-green-400' :
                            'bg-gray-800 text-gray-400'}
                        `}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {user.messagesUsed} / {user.messagesLimit}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {user.isBlocked ? (
                            <span className="px-2 py-1 text-xs font-medium rounded bg-red-900/20 text-red-400">
                              Bloqueado
                            </span>
                          ) : user.isActive ? (
                            <span className="px-2 py-1 text-xs font-medium rounded bg-green-900/20 text-green-400">
                              Activo
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded bg-gray-800 text-gray-400">
                              Inactivo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString('es-ES')
                          : 'Nunca'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(user)}
                            disabled={!canEdit}
                            className={`px-3 py-1 text-sm rounded text-white transition-colors ${
                              canEdit 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-gray-700 cursor-not-allowed opacity-50'
                            }`}
                            title={!canEdit ? 'No tienes permisos para editar este usuario' : ''}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={!canDelete}
                            className={`px-3 py-1 text-sm rounded text-white transition-colors ${
                              canDelete 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-gray-700 cursor-not-allowed opacity-50'
                            }`}
                            title={!canDelete ? 'No tienes permisos para eliminar este usuario' : ''}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {showModal && editingUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Rol</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-600"
                    >
                      {getAvailableRoles().map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {currentUserRole === 'SUPER' && (
                      <p className="text-xs text-yellow-400 mt-1">SUPER no puede asignar roles SUPER/OWNER</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Plan</label>
                    <select
                      value={editingUser.plan}
                      onChange={(e) => {
                        const newPlan = e.target.value
                        setEditingUser({
                          ...editingUser,
                          plan: newPlan,
                          messagesLimit: PLAN_LIMITS[newPlan as keyof typeof PLAN_LIMITS] || 10
                        })
                      }}
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="FREE">FREE (10 mensajes)</option>
                      <option value="BETA">BETA (2,500 mensajes)</option>
                      <option value="PRO">PRO (500 mensajes)</option>
                      <option value="PREMIUM">PREMIUM (1,200 mensajes)</option>
                      <option value="ENTERPRISE">ENTERPRISE (4,500 mensajes)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">Límite de mensajes (automático)</div>
                  <div className="text-lg font-semibold text-white">
                    {PLAN_LIMITS[editingUser.plan as keyof typeof PLAN_LIMITS] || 10} mensajes/mes
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Se ajusta automáticamente según el plan seleccionado
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.isActive}
                      onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                      className="w-4 h-4 bg-[#0f0f0f] border-gray-800 rounded focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-300">Usuario activo</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.isBlocked}
                      onChange={(e) => setEditingUser({ ...editingUser, isBlocked: e.target.checked })}
                      className="w-4 h-4 bg-[#0f0f0f] border-gray-800 rounded focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-300">Usuario bloqueado</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingUser(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
