'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface UserData {
  id: string
  email: string
  name: string | null
  plan: string
  messagesUsed: number
  messagesLimit: number
  subscriptionStatus: string
  stripeCustomerId: string | null
  createdAt: string
}

export default function AccountPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const res = await fetch('/api/user/account')
      const data = await res.json()
      setUserData(data)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('¿Estás seguro de cancelar tu suscripción? Perderás acceso a las funciones premium al final del período de facturación.')) {
      return
    }

    setCanceling(true)
    try {
      const res = await fetch('/api/user/cancel-subscription', {
        method: 'POST',
      })

      if (res.ok) {
        alert('Suscripción cancelada exitosamente')
        await loadUserData()
      } else {
        alert('Error al cancelar la suscripción')
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      alert('Error al cancelar la suscripción')
    } finally {
      setCanceling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-red-400">Error al cargar datos de usuario</div>
      </div>
    )
  }

  const planColors = {
    FREE: 'bg-gray-800 text-gray-300',
    PRO: 'bg-blue-900/20 text-blue-400 border border-blue-800',
    PREMIUM: 'bg-purple-900/20 text-purple-400 border border-purple-800',
    ENTERPRISE: 'bg-yellow-900/20 text-yellow-400 border border-yellow-800',
  }

  const usagePercentage = (userData.messagesUsed / userData.messagesLimit) * 100

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image src="/logo-from-e.png" alt="Frome Labs" width={40} height={40} />
            <h1 className="text-2xl font-semibold">Mi Cuenta</h1>
          </div>
          <button
            onClick={() => router.push('/chat')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Ir al Chat
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Información de la Cuenta</h2>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400">Nombre</div>
              <div className="text-white">{userData.name || 'Sin nombre'}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400">Email</div>
              <div className="text-white">{userData.email}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400">Miembro desde</div>
              <div className="text-white">
                {new Date(userData.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Plan Actual</h2>
            <span className={`px-3 py-1 rounded-lg font-medium ${planColors[userData.plan as keyof typeof planColors]}`}>
              {userData.plan}
            </span>
          </div>

          {userData.plan !== 'FREE' && (
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Estado de la suscripción</div>
              <div className="text-white capitalize">{userData.subscriptionStatus}</div>
            </div>
          )}

          {/* Usage Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Mensajes utilizados</span>
              <span className="text-white font-medium">
                {userData.messagesUsed} / {userData.messagesLimit}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  usagePercentage >= 90 ? 'bg-red-500' :
                  usagePercentage >= 70 ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            {usagePercentage >= 90 && (
              <p className="text-sm text-red-400 mt-2">
                ⚠️ Estás cerca del límite de mensajes. Considera actualizar tu plan.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/pricing')}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {userData.plan === 'FREE' ? 'Actualizar Plan' : 'Cambiar Plan'}
            </button>
            
            {userData.plan !== 'FREE' && userData.subscriptionStatus === 'active' && (
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {canceling ? 'Cancelando...' : 'Cancelar Suscripción'}
              </button>
            )}
          </div>
        </div>

        {/* Plan Features */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Características de tu Plan</h2>
          
          <ul className="space-y-2">
            {userData.plan === 'FREE' && (
              <>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  50 mensajes mensuales
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  From E Labs
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Historial de conversaciones
                </li>
              </>
            )}
            
            {userData.plan === 'PRO' && (
              <>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  500 mensajes mensuales
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  From E Labs
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Historial ilimitado
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Soporte prioritario
                </li>
              </>
            )}
            
            {userData.plan === 'PREMIUM' && (
              <>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  2,000 mensajes mensuales
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Todo de Pro
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Soporte VIP
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Acceso anticipado a funciones
                </li>
              </>
            )}
            
            {userData.plan === 'ENTERPRISE' && (
              <>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  10,000 mensajes mensuales
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Todo de Premium
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Soporte dedicado 24/7
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Integraciones personalizadas
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
