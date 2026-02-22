# GUÍA COMPLETA DE IMPLEMENTACIÓN
## Sistema Auth.js v5 + Dashboard Admin con Roles

### ✅ ARCHIVOS YA CREADOS (10 archivos principales)

1. **schema.prisma** - Schema con UserRole enum
2. **auth.ts** - Auth.js v5 completo con seguridad
3. **middleware.ts** - Control de acceso por roles
4. **types/roles.ts** - Sistema de permisos
5. **api-auth-nextauth-route.ts** - Handler Auth.js
6. **api-auth-register-route.ts** - Registro de usuarios
7. **api-admin-stats-route.ts** - API de estadísticas ⭐
8. **api-admin-users-route.ts** - CRUD usuarios con roles
9. **app-login-page.tsx** - Login con Auth.js v5
10. **app-admin-estadisticas-page.tsx** - Página con 4 gráficas ⭐⭐⭐

### 🎯 CARACTERÍSTICAS IMPLEMENTADAS

#### Página de Estadísticas (app-admin-estadisticas-page.tsx)
- ✅ Selector de rango: 1D / 7D / 30D / 90D / 180D / 1A
- ✅ Gráfica 1: Usuarios nuevos por día (LineChart - Recharts)
- ✅ Gráfica 2: Mensajes enviados (LineChart - Recharts)  
- ✅ Gráfica 3: Distribución de planes (PieChart - Recharts)
- ✅ Gráfica 4: Coste API estimado (Panel con desglose)
- ✅ Métricas rápidas en cards
- ✅ Estilo minimalista sin emojis
- ✅ Colores: negro, grises, blanco, azul marino

#### Sistema de Roles
- USER: Sin acceso admin
- MODERATOR: Ver estadísticas y logs
- ADMIN: Gestión completa excepto roles
- SUPER: Control total

### 📝 INSTALACIÓN PASO A PASO

#### 1. Preparar Base de Datos (PostgreSQL en 134.199.134.93:65535)

```bash
# Terminal 1: Abrir túnel SSH
ssh -L 65535:localhost:5432 user@134.199.134.93 -N

# Terminal 2: Aplicar migración
cd tu-proyecto
npx prisma migrate dev --name add_user_roles
npx prisma generate
```

#### 2. Reemplazar Archivos

```bash
# Configuración
cp schema.prisma prisma/schema.prisma
cp auth.ts auth.ts
cp middleware.ts middleware.ts

# Types
mkdir -p types
cp types/roles.ts types/roles.ts

# APIs
mkdir -p app/api/auth/\[...nextauth\]
cp api-auth-nextauth-route.ts app/api/auth/\[...nextauth\]/route.ts
cp api-auth-register-route.ts app/api/auth/register/route.ts

mkdir -p app/api/admin
cp api-admin-stats-route.ts app/api/admin/stats/route.ts  
cp api-admin-users-route.ts app/api/admin/users/route.ts

# Páginas
cp app-login-page.tsx app/login/page.tsx

mkdir -p app/admin/estadisticas
cp app-admin-estadisticas-page.tsx app/admin/estadisticas/page.tsx
```

#### 3. Limpiar Caché y Reiniciar

```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

#### 4. Crear Primer Super Admin

```sql
-- Conectar a la base de datos
UPDATE "User" 
SET role = 'SUPER', "isAdmin" = true 
WHERE email = 'tu-email@ejemplo.com';
```

#### 5. Verificar

1. Ir a http://localhost:3000/login
2. Iniciar sesión
3. Ir a http://localhost:3000/admin/estadisticas
4. Probar selector de rango
5. Verificar las 4 gráficas

### 📊 USO DE LA PÁGINA DE ESTADÍSTICAS

```
/admin/estadisticas

Selector de rango (arriba derecha): 1D | 7D | 30D | 90D | 180D | 1A

Métricas rápidas (5 cards):
- Total Usuarios
- Usuarios Activos
- Total Mensajes
- Nuevos (período seleccionado)
- Mensajes (período seleccionado)

4 Gráficas:
1. LineChart: Usuarios nuevos por día
2. LineChart: Mensajes enviados por día
3. PieChart: Distribución de planes (FREE/PRO/ENTERPRISE)
4. Panel: Coste API con desglose (total, tokens, requests, promedio)
```

### 🔧 ARCHIVOS PENDIENTES (Opcionales)

Si necesitas las demás páginas del admin:
- app/register/page.tsx
- app/page.tsx (chat actualizado a Auth.js v5)
- app/admin/layout.tsx (sidebar)
- app/admin/page.tsx (dashboard principal)
- app/admin/users/page.tsx (gestión usuarios con tabla)
- app/admin/seguridad/page.tsx (logs de login)
- app/admin/suscripciones/page.tsx (Stripe)

Dime si necesitas que cree estos archivos adicionales.

### ⚠️ NOTAS IMPORTANTES

- **Recharts**: Ya instalado con `npm install recharts --legacy-peer-deps`
- **PostgreSQL**: Túnel debe estar abierto en puerto 65535
- **Auth.js v5**: Incompatible con next-auth/react (usa auth() server-side)
- **Datos corruptos**: La API filtra y limpia automáticamente
- **Estilo**: Sin emojis, minimalista, siguiendo Claude/ChatGPT

### 🐛 TROUBLESHOOTING

**Error: Cannot find module '@/auth'**
→ Asegúrate de que auth.ts está en la raíz del proyecto

**Error: Prisma Client no generado**
→ Ejecuta `npx prisma generate`

**Gráficas no cargan**
→ Verifica que el túnel PostgreSQL esté abierto
→ Revisa que tu usuario tenga rol MODERATOR/ADMIN/SUPER

**Error 403 en /admin/estadisticas**
→ Tu usuario necesita rol MODERATOR o superior
→ Ejecuta el UPDATE SQL del paso 4

### 📞 SIGUIENTE PASO

¿Quieres que cree los archivos adicionales (register, dashboard principal, gestión usuarios, etc.)?

