'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'

interface SessionWarningModalProps {
  onClose: () => void
  onCloseOtherSession: () => void
  sessionInfo: {
    device: string
    createdAt: string
  }
}

export default function SessionWarningModal({ 
  onClose, 
  onCloseOtherSession, 
  sessionInfo 
}: SessionWarningModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleCloseOtherSession = async () => {
    setIsClosing(true)
    try {
      await onCloseOtherSession()
    } catch (error) {
      console.error('Error cerrando sesión:', error)
      setIsClosing(false)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-md w-full p-8 border border-gray-700 shadow-2xl">
        {/* Icono de advertencia */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Sesión Activa Detectada
        </h2>

        {/* Mensaje */}
        <p className="text-gray-300 text-center mb-6">
          Tu cuenta ya tiene una sesión activa en otro dispositivo:
        </p>

        {/* Info de la sesión activa */}
        <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Dispositivo:</span>
            <span className="text-white font-medium">{sessionInfo.device}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Iniciada:</span>
            <span className="text-white font-medium text-sm">
              {formatDate(sessionInfo.createdAt)}
            </span>
          </div>
        </div>

        {/* Advertencia */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
          <p className="text-yellow-500 text-sm text-center">
            Solo puedes tener una sesión activa a la vez por seguridad.
          </p>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={handleCloseOtherSession}
            disabled={isClosing}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isClosing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cerrando sesión...
              </span>
            ) : (
              'Cerrar otra sesión y continuar aquí'
            )}
          </button>

          <button
            onClick={handleLogout}
            disabled={isClosing}
            className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar y cerrar esta sesión
          </button>
        </div>

        {/* Texto informativo */}
        <p className="text-gray-500 text-xs text-center mt-4">
          Esta medida de seguridad protege tu cuenta de accesos no autorizados.
        </p>
      </div>
    </div>
  )
}
