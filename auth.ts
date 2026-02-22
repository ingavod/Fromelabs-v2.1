import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { UserRole } from "@/types/roles"

declare module "next-auth" {
  interface User {
    role?: UserRole
    isAdmin?: boolean
    plan?: string
    messagesUsed?: number
    messagesLimit?: number
  }
  interface Session {
    user: User & {
      id: string
      role: UserRole
      isAdmin: boolean
      plan: string
      messagesUsed: number
      messagesLimit: number
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    role: UserRole
    isAdmin: boolean
    plan: string
    messagesUsed: number
    messagesLimit: number
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: '/login' },
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    }
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos")
        }

        const email = credentials.email as string
        const password = credentials.password as string

        try {
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              passwordHash: true,
              role: true,
              isAdmin: true,
              isActive: true,
              isBlocked: true,
              blockedUntil: true,
              plan: true,
              messagesUsed: true,
              messagesLimit: true,
              emailVerified: true,
            }
          })

          if (!user) {
            await prisma.loginAttempt.create({
              data: { email, success: false, failCount: 1 }
            })
            throw new Error("Credenciales incorrectas")
          }

          if (user.isBlocked) {
            if (user.blockedUntil && user.blockedUntil > new Date()) {
              throw new Error(`Cuenta bloqueada hasta ${user.blockedUntil.toLocaleString('es-ES')}`)
            }
            await prisma.user.update({
              where: { id: user.id },
              data: { isBlocked: false, blockedUntil: null }
            })
          }

          if (!user.isActive) {
            throw new Error("Cuenta inactiva. Contacta al administrador.")
          }

          // Verificar que el email esté verificado
          if (!user.emailVerified) {
            throw new Error("Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.")
          }

          const passwordMatch = await bcrypt.compare(password, user.passwordHash)

          if (!passwordMatch) {
            const attempts = await prisma.loginAttempt.findFirst({
              where: { email },
              orderBy: { createdAt: 'desc' }
            })

            const failCount = (attempts?.failCount || 0) + 1

            await prisma.loginAttempt.create({
              data: { email, userId: user.id, success: false, failCount }
            })

            if (failCount >= 5) {
              const blockedUntil = new Date(Date.now() + 15 * 60 * 1000)
              await prisma.user.update({
                where: { id: user.id },
                data: { isBlocked: true, blockedUntil }
              })
              throw new Error("Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.")
            }

            throw new Error("Credenciales incorrectas")
          }

          await prisma.loginAttempt.create({
            data: { email, userId: user.id, success: true, failCount: 0 }
          })

          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })

          const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER' || user.role === 'MODERATOR'

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isAdmin,
            plan: user.plan,
            messagesUsed: user.messagesUsed,
            messagesLimit: user.messagesLimit,
          }
        } catch (error) {
          if (error instanceof Error) throw error
          throw new Error("Error al iniciar sesión")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role || 'USER'
        token.isAdmin = user.role === 'ADMIN' || user.role === 'SUPER' || user.role === 'MODERATOR' || user.role === 'OWNER'
        token.plan = user.plan || "FREE"
        token.messagesUsed = user.messagesUsed || 0
        token.messagesLimit = user.messagesLimit || 50
      }

      if (trigger === "update" && session) {
        token.messagesUsed = session.messagesUsed
        token.messagesLimit = session.messagesLimit
        token.plan = session.plan
        if (session.role) token.role = session.role
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.isAdmin = token.isAdmin as boolean
        session.user.plan = token.plan as string
        session.user.messagesUsed = token.messagesUsed as number
        session.user.messagesLimit = token.messagesLimit as number
      }
      return session
    },
  },
})
