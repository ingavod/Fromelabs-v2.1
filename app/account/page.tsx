'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SessionGuard from '@/components/session/SessionGuard'

interface UserData {
  id: string
  email: string
  name: string | null
  plan: string
  messagesUsed: number
  messagesLimit: number
  createdAt: string
}

const planFeatures = {
  FREE: ['50 mensajes/mes', 'Memoria 7 días', 'Modelos básicos'],
  STARTER: ['500 mensajes/mes', 'Memoria 30 días', 'Prioridad normal'],
  PRO: ['2,000 mensajes/mes', 'API & Webhooks', 'Memoria ilimitada', 'Sin anuncios'],
  BUSINESS: ['10,000 mensajes/mes', 'Multi-usuario (5)', 'Analytics avanzado', 'SLA 99.5%'],
  ENTERPRISE: ['Mensajes ilimitados', 'On-premise', 'SLA 99.9%', 'Soporte 24/7']
}

const planPrices = {
  FREE: '0€/mes',
  STARTER: '9€/mes',
  PRO: '29€/mes',
  BUSINESS: '99€/mes',
  ENTERPRISE: 'Personalizado'
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (!response.ok) throw new Error('Error al cargar datos del usuario')
      const data = await response.json()
      setUserData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando tu cuenta...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/chat')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            Volver al Chat
          </button>
        </div>
      </div>
    )
  }

  if (!userData) return null

  const usagePercentage = (userData.messagesUsed / userData.messagesLimit) * 100

  return (
    <SessionGuard>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/chat')}
            className="text-purple-400 hover:text-purple-300 mb-6 inline-flex items-center"
          >
            ← Volver al Chat
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Mi Cuenta</h1>
          <p className="text-gray-400">Gestiona tu perfil y suscripción</p>
        </div>

        {/* Información del Usuario */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-6 border border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {userData.name?.charAt(0).toUpperCase() || userData.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userData.name || 'Usuario'}</h2>
                <p className="text-gray-400">{userData.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Miembro desde {new Date(userData.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold">
                Plan {userData.plan}
              </span>
              <p className="text-gray-400 text-sm mt-2">{planPrices[userData.plan as keyof typeof planPrices]}</p>
            </div>
          </div>
        </div>

        {/* Uso de Mensajes */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Uso de Mensajes</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">
                {userData.messagesUsed} de {userData.messagesLimit === -1 ? '∞' : userData.messagesLimit} mensajes
              </span>
              <span className="text-gray-400">
                {userData.messagesLimit === -1 ? '∞' : `${Math.round(usagePercentage)}%`}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 70 ? 'bg-yellow-500' : 'bg-purple-500'
                }`}
                style={{ width: userData.messagesLimit === -1 ? '100%' : `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>
          {userData.messagesLimit !== -1 && usagePercentage > 80 && (
            <p className="text-yellow-400 text-sm mt-2">
              ⚠️ Te estás acercando al límite de tu plan. Considera actualizar para seguir disfrutando del servicio.
            </p>
          )}
        </div>

        {/* Características del Plan */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Características de tu Plan</h3>
          <ul className="space-y-3">
            {planFeatures[userData.plan as keyof typeof planFeatures]?.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Actualizar Plan */}
        {userData.plan !== 'ENTERPRISE' && (
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-700 mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">¿Necesitas más?</h3>
            <p className="text-gray-400 mb-4">
              Actualiza tu plan para obtener más mensajes, funciones avanzadas y soporte prioritario.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition transform hover:scale-105"
            >
              Ver Planes Disponibles
            </button>
          </div>
        )}

        {/* Legal disclaimer */}
        <p className="text-center text-[11px] text-gray-500 mt-8 mb-4 px-4">
          Al usar FromE, aceptas nuestras{' '}
          <a href="/legal/condiciones" className="underline hover:text-gray-400">condiciones de servicio</a>
          {' '}y{' '}
          <a href="/legal/uso-aceptable" className="underline hover:text-gray-400">política de uso aceptable</a>,{' '}
          y confirmas que has leído nuestra{' '}
          <a href="/legal/privacidad" className="underline hover:text-gray-400">política de privacidad</a>.
        </p>
      </div>
    </SessionGuard>
  )
}
