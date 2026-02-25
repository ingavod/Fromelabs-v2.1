'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  ROLE_DESCRIPTIONS, 
  ROLE_PERMISSIONS, 
  PERMISSIONS,
  ROLE_HIERARCHY,
  type UserRole 
} from '@/types/roles'

export default function RolesPage() {
  const router = useRouter()

  const roles: UserRole[] = ['USER', 'MODERATOR', 'ADMIN', 'SUPER']

  const permissionCategories = {
    'Usuario Básico': [
      PERMISSIONS.USE_CHAT,
      PERMISSIONS.VIEW_OWN_ACCOUNT,
      PERMISSIONS.UPDATE_OWN_PROFILE,
      PERMISSIONS.MANAGE_OWN_SUBSCRIPTION,
      PERMISSIONS.VIEW_OWN_CONVERSATIONS,
    ],
    'Moderación': [
      PERMISSIONS.VIEW_USERS_LIST,
      PERMISSIONS.VIEW_BASIC_STATS,
      PERMISSIONS.VIEW_USER_DETAILS,
    ],
    'Administración': [
      PERMISSIONS.EDIT_USERS,
      PERMISSIONS.BLOCK_USERS,
      PERMISSIONS.CHANGE_USER_PLAN,
      PERMISSIONS.VIEW_FULL_STATS,
      PERMISSIONS.MANAGE_USER_ROLES,
    ],
    'Super Admin': [
      PERMISSIONS.DELETE_USERS,
      PERMISSIONS.CHANGE_ADMIN_ROLES,
      PERMISSIONS.FULL_SYSTEM_ACCESS,
      PERMISSIONS.MANAGE_SUPER_ADMINS,
    ],
  }

  const permissionLabels: Record<string, string> = {
    [PERMISSIONS.USE_CHAT]: 'Usar el chat',
    [PERMISSIONS.VIEW_OWN_ACCOUNT]: 'Ver su cuenta',
    [PERMISSIONS.UPDATE_OWN_PROFILE]: 'Actualizar su perfil',
    [PERMISSIONS.MANAGE_OWN_SUBSCRIPTION]: 'Gestionar suscripción',
    [PERMISSIONS.VIEW_OWN_CONVERSATIONS]: 'Ver sus conversaciones',
    [PERMISSIONS.VIEW_USERS_LIST]: 'Ver lista de usuarios',
    [PERMISSIONS.VIEW_BASIC_STATS]: 'Ver estadísticas básicas',
    [PERMISSIONS.VIEW_USER_DETAILS]: 'Ver detalles de usuarios',
    [PERMISSIONS.EDIT_USERS]: 'Editar usuarios',
    [PERMISSIONS.BLOCK_USERS]: 'Bloquear usuarios',
    [PERMISSIONS.CHANGE_USER_PLAN]: 'Cambiar plan de usuarios',
    [PERMISSIONS.VIEW_FULL_STATS]: 'Ver estadísticas completas',
    [PERMISSIONS.MANAGE_USER_ROLES]: 'Gestionar roles (USER/MOD)',
    [PERMISSIONS.DELETE_USERS]: 'Eliminar usuarios',
    [PERMISSIONS.CHANGE_ADMIN_ROLES]: 'Cambiar roles de admins',
    [PERMISSIONS.FULL_SYSTEM_ACCESS]: 'Acceso total al sistema',
    [PERMISSIONS.MANAGE_SUPER_ADMINS]: 'Gestionar super admins',
  }

  const roleColors: Record<UserRole, string> = {
    USER: 'bg-gray-800 text-gray-300',
    MODERATOR: 'bg-yellow-900/20 text-yellow-400 border border-yellow-800',
    ADMIN: 'bg-red-900/20 text-red-400 border border-red-800',
    SUPER: 'bg-purple-900/20 text-purple-400 border border-purple-800',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image src="/logo-from-e.png" alt="Frome Labs" width={40} height={40} />
            <h1 className="text-2xl font-semibold">Roles y Permisos</h1>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 hover:bg-[#2a2a2a] rounded-lg text-white transition-colors"
          >
            ← Volver
          </button>
        </div>

        {/* Descripción */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sistema de Roles</h2>
          <p className="text-gray-400 mb-4">
            El sistema utiliza una jerarquía de roles donde cada nivel superior hereda todos los permisos de los niveles inferiores.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Jerarquía:</span>
            <span className="text-gray-400">USER (0)</span>
            <span>→</span>
            <span className="text-yellow-400">MODERATOR (1)</span>
            <span>→</span>
            <span className="text-red-400">ADMIN (2)</span>
            <span>→</span>
            <span className="text-purple-400">SUPER (3)</span>
          </div>
        </div>

        {/* Roles Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {roles.map((role) => (
            <div
              key={role}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-lg font-medium text-sm ${roleColors[role]}`}>
                  {role}
                </span>
                <span className="text-gray-500 text-xs">
                  Nivel {ROLE_HIERARCHY[role]}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {ROLE_DESCRIPTIONS[role]}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Permisos totales</div>
                <div className="text-2xl font-bold text-white">
                  {ROLE_PERMISSIONS[role].length}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Permissions Matrix */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold">Matriz de Permisos</h2>
            <p className="text-sm text-gray-400 mt-1">
              Marca de verificación (✓) indica que el rol tiene ese permiso
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f0f0f] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase sticky left-0 bg-[#0f0f0f]">
                    Permiso
                  </th>
                  {roles.map((role) => (
                    <th key={role} className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">
                      <span className={`px-2 py-1 rounded ${roleColors[role]}`}>
                        {role}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {Object.entries(permissionCategories).map(([category, permissions]) => (
                  <>
                    <tr key={category} className="bg-[#0f0f0f]">
                      <td colSpan={5} className="px-4 py-2 text-sm font-semibold text-blue-400">
                        {category}
                      </td>
                    </tr>
                    {permissions.map((permission) => (
                      <tr key={permission} className="hover:bg-[#1f1f1f] transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-300 sticky left-0 bg-[#1a1a1a]">
                          {permissionLabels[permission]}
                        </td>
                        {roles.map((role) => {
                          const hasPermission = ROLE_PERMISSIONS[role].includes(permission)
                          return (
                            <td key={role} className="px-4 py-3 text-center">
                              {hasPermission ? (
                                <span className="text-green-400 text-xl">✓</span>
                              ) : (
                                <span className="text-gray-700 text-xl">—</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Management Rules */}
        <div className="mt-6 bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Reglas de Gestión de Roles</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">●</span>
              <div>
                <div className="font-medium text-white">Jerarquía de Permisos</div>
                <div className="text-sm text-gray-400">
                  Un rol solo puede gestionar roles de nivel inferior. Por ejemplo, un ADMIN no puede cambiar el rol de otro ADMIN o SUPER.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">●</span>
              <div>
                <div className="font-medium text-white">MODERATOR</div>
                <div className="text-sm text-gray-400">
                  Puede ver todo pero no puede editar. Ideal para supervisión sin riesgo de cambios accidentales.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">●</span>
              <div>
                <div className="font-medium text-white">ADMIN</div>
                <div className="text-sm text-gray-400">
                  Puede gestionar usuarios normales y moderadores, cambiar planes, editar y bloquear usuarios.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">●</span>
              <div>
                <div className="font-medium text-white">SUPER</div>
                <div className="text-sm text-gray-400">
                  Acceso total. Es el único que puede eliminar usuarios y gestionar otros administradores. Úsalo con precaución.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-red-400 mt-1">⚠</span>
              <div>
                <div className="font-medium text-red-400">Protección</div>
                <div className="text-sm text-gray-400">
                  Ningún administrador puede eliminarse a sí mismo. Debe ser eliminado por otro SUPER admin.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
