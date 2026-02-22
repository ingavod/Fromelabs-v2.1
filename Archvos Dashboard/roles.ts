// types/roles.ts
export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

export const ROLE_PERMISSIONS = {
  ADMIN: {
    canManageUsers: true,
    canEditContent: true,
    canViewStats: true,
    canDeleteContent: true,
    canAccessAdmin: true,
  },
  EDITOR: {
    canManageUsers: false,
    canEditContent: true,
    canViewStats: true,
    canDeleteContent: false,
    canAccessAdmin: true,
  },
  VIEWER: {
    canManageUsers: false,
    canEditContent: false,
    canViewStats: true,
    canDeleteContent: false,
    canAccessAdmin: false,
  },
} as const;

export function hasPermission(
  role: Role | undefined,
  permission: keyof typeof ROLE_PERMISSIONS.ADMIN
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role][permission];
}
