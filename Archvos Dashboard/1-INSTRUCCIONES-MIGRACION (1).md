# GUÍA DE MIGRACIÓN COMPLETA - Auth.js v5 + Dashboard Admin

## PASO 1: Preparar Base de Datos

```bash
# Reabrir túnel PostgreSQL
ssh -L 65535:localhost:5432 user@134.199.134.93 -N

# En otra terminal, aplicar migración
npx prisma migrate dev --name add_user_roles
npx prisma generate
```

## PASO 2: Reemplazar Archivos

Copia los archivos en este orden:

### Configuración (raíz del proyecto)
1. schema.prisma → prisma/schema.prisma
2. auth.ts → auth.ts  
3. middleware.ts → middleware.ts

### Types
4. types/roles.ts → types/roles.ts

### API Routes  
5. api/auth/[...nextauth]/route.ts → app/api/auth/[...nextauth]/route.ts
6. api/auth/register/route.ts → app/api/auth/register/route.ts
7. api/admin/stats/route.ts → app/api/admin/stats/route.ts
8. api/admin/users/route.ts → app/api/admin/users/route.ts

### Páginas principales
9. app/page.tsx → app/page.tsx
10. app/login/page.tsx → app/login/page.tsx
11. app/register/page.tsx → app/register/page.tsx

### Dashboard Admin
12. app/admin/layout.tsx → app/admin/layout.tsx
13. app/admin/page.tsx → app/admin/page.tsx
14. app/admin/users/page.tsx → app/admin/users/page.tsx
15. app/admin/estadisticas/page.tsx → app/admin/estadisticas/page.tsx
16. app/admin/seguridad/page.tsx → app/admin/seguridad/page.tsx
17. app/admin/suscripciones/page.tsx → app/admin/suscripciones/page.tsx

### Componentes
18. components/admin/Sidebar.tsx → components/admin/Sidebar.tsx
19. components/admin/StatsCard.tsx → components/admin/StatsCard.tsx
20. components/admin/UserTable.tsx → components/admin/UserTable.tsx

## PASO 3: Limpiar Caché

```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

## PASO 4: Crear Primer Super Admin

```sql
-- Conectar a la base de datos
UPDATE "User" 
SET role = 'SUPER', "isAdmin" = true 
WHERE email = 'tu-email@example.com';
```

## PASO 5: Verificar

1. Login en /login
2. Ir a /admin (debería funcionar si eres SUPER/ADMIN/MODERATOR)
3. Ir a /admin/estadisticas para ver las gráficas
4. Probar selector de rango: 1D, 7D, 30D, 90D, 180D, 1A

## Notas Importantes

- **Recharts** ya está instalado (con --legacy-peer-deps)
- **Estilo**: Minimalista sin emojis, colores sobrios
- **Roles**: USER < MODERATOR < ADMIN < SUPER
- **Datos corruptos**: La API filtra y limpia automáticamente

