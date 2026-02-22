import { prisma } from '@/lib/prisma'
import { auth as nextAuth } from '@/auth'

export async function getAuthenticatedUser() {
  try {
    const session = await nextAuth()
    
    if (!session?.user?.email) {
      console.log('❌ No session from nextAuth()')
      return null
    }

    console.log('✅ Session email:', session.user.email)

    // Always fetch fresh user data from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAdmin: true,
        isActive: true,
        isBlocked: true,
        plan: true,
        messagesUsed: true,
        messagesLimit: true,
        tokensUsed: true,
      },
    })

    if (!user) {
      console.log('❌ User not found in database')
      return null
    }

    if (!user.isActive) {
      console.log('❌ User is not active')
      return null
    }

    if (user.isBlocked) {
      console.log('❌ User is blocked')
      return null
    }

    console.log('✅ User authenticated:', user.email)
    return user
  } catch (error) {
    console.error('❌ Error in getAuthenticatedUser:', error)
    return null
  }
}
