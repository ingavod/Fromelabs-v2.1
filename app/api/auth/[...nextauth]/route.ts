import { handlers } from '@/auth'

export const { GET, POST } = handlers

 
  callbacks: {
    async signIn({ user }) {
      // Generar un token único para esta sesión
      const sessionToken = crypto.randomUUID()
      
      // Actualizar el token de sesión activa en la BD
      await prisma.user.update({
        where: { id: user.id },
        data: { activeSessionToken: sessionToken }
      })
      
      // Guardar el token en el usuario para validarlo después
      user.sessionToken = sessionToken
      
      return true
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.sessionToken = user.sessionToken
        token.userId = user.id
      }
      return token
    },
    
    async session({ session, token }) {
      // Verificar que la sesión sigue siendo válida
      const user = await prisma.user.findUnique({
        where: { id: token.userId },
        select: { activeSessionToken: true }
      })
      
      // Si el token no coincide, la sesión fue invalidada
      if (user?.activeSessionToken !== token.sessionToken) {
        throw new Error('Session invalidated')
      }
      
      session.user.id = token.userId
      return session
    }
  }
}
