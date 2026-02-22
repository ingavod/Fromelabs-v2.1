'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

// Colores del tema
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#2a2a2a',
  navy: '#1e40af',
  navyBord: '#2563eb',
  text: '#e5e5e5',
  textSub: '#a3a3a3',
  success: '#22c55e',
  error: '#ef4444',
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token no proporcionado')
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/verify-email?token=${token}`)
        const data = await res.json()

        if (res.ok) {
          setStatus('success')
          setMessage(data.message)
          
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error)
        }
      } catch {
        setStatus('error')
        setMessage('Error al verificar el email')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px'
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'inline-block',
            background: C.surface,
            border: `1px solid ${C.border}`,
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <Image src="/logo-from-e.png" alt="From E Labs" width={48} height={48} />
          </div>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: C.text
          }}>
            From E Labs
          </h1>
        </div>

        {/* Card */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center'
        }}>
          {status === 'loading' && (
            <>
              <div style={{
                width: '48px',
                height: '48px',
                border: `3px solid ${C.border}`,
                borderTop: `3px solid ${C.navy}`,
                borderRadius: '50%',
                margin: '0 auto 24px',
                animation: 'spin 1s linear infinite'
              }} />
              <h2 style={{
                margin: '0 0 12px 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: C.text
              }}>
                Verificando email...
              </h2>
              <p style={{
                margin: 0,
                color: C.textSub,
                fontSize: '0.875rem'
              }}>
                Por favor espera un momento
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `rgba(34, 197, 94, 0.1)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" stroke={C.success} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style={{
                margin: '0 0 12px 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: C.success
              }}>
                Email verificado
              </h2>
              <p style={{
                margin: '0 0 24px 0',
                color: C.textSub,
                fontSize: '0.875rem'
              }}>
                {message}
              </p>
              <p style={{
                margin: 0,
                color: C.textSub,
                fontSize: '0.75rem'
              }}>
                Redirigiendo al login...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `rgba(239, 68, 68, 0.1)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" stroke={C.error} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 style={{
                margin: '0 0 12px 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: C.error
              }}>
                Error de verificación
              </h2>
              <p style={{
                margin: '0 0 24px 0',
                color: C.textSub,
                fontSize: '0.875rem'
              }}>
                {message}
              </p>
              <button
                onClick={() => router.push('/login')}
                style={{
                  padding: '10px 24px',
                  background: C.navy,
                  border: 'none',
                  borderRadius: '8px',
                  color: C.text,
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = C.navyBord}
                onMouseOut={(e) => e.currentTarget.style.background = C.navy}
              >
                Ir al Login
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
