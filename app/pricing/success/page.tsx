'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/chat')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      color: '#ffffff',
      padding: '20px'
    }}>
      <Image
        src="/logo.png"
        alt="From E Labs"
        width={200}
        height={60}
        style={{ marginBottom: '40px' }}
      />

      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '20px',
          color: '#00ced1'
        }}>
          ✓ ¡Pago Exitoso!
        </h1>

        <p style={{
          fontSize: '20px',
          marginBottom: '30px',
          color: '#e0e0e0'
        }}>
          Tu suscripción ha sido activada correctamente
        </p>

        {sessionId && (
          <p style={{
            fontSize: '14px',
            color: '#888',
            marginBottom: '30px'
          }}>
            ID de sesión: {sessionId}
          </p>
        )}

        <p style={{
          fontSize: '16px',
          color: '#00ced1',
          marginTop: '40px'
        }}>
          Redirigiendo al chat en {countdown} segundos...
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
