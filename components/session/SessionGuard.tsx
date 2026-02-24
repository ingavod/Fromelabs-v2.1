'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import SessionWarningModal from './SessionWarningModal'

interface SessionGuardProps {
  children: React.ReactNode
}

export default function SessionGuard({ children }: SessionGuardProps) {
  const { data: session, status } = useSession()
  const [showWarning, setShowWarning] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      checkSession()
    }
  }, [status])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/check-session')
      const data = await response.json()

      if (data.hasActiveSession && data.sessionInfo) {
        setSessionInfo(data.sessionInfo)
        setShowWarning(true)
      }
    } catch (error) {
      console.error('Error verificando sesión:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleCloseOtherSession = async () => {
    try {
      const response = await fetch('/api/auth/close-other-session', {
        method: 'POST'
      })

      if (response.ok) {
        // Crear nueva sesión para este dispositivo
        await fetch('/api/auth/create-session', {
          method: 'POST'
        })
        setShowWarning(false)
      } else {
        throw new Error('Error cerrando sesión')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al cerrar la otra sesión. Por favor, intenta de nuevo.')
    }
  }

  if (status === 'loading' || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showWarning && sessionInfo && (
        <SessionWarningModal
          onClose={() => setShowWarning(false)}
          onCloseOtherSession={handleCloseOtherSession}
          sessionInfo={sessionInfo}
        />
      )}
      {children}
    </>
  )
}
