'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Colores del sistema
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#2a2a2a',
  navy: '#1e40af',
  navyBord: '#2563eb',
  text: '#e5e5e5',
  textSub: '#a3a3a3',
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Error al enviar el email')
      }
    } catch (error) {
      setError('Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#f1f5f9',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: C.bg,
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              background: '#111',
              border: '1px solid #222',
              padding: '8px',
              borderRadius: '10px'
            }}>
              <Image src="/logo-from-e.png" alt="From E Labs" width={52} height={52} style={{ display: 'block' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#f1f5f9' }}>
              From E Labs
            </h1>
          </div>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            Recuperar contraseña
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: C.surface,
          border: '1px solid #222',
          borderRadius: '12px',
          padding: '28px'
        }}>
          {success ? (
            <div>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                textAlign: 'center',
                margin: '0 0 12px 0',
                color: C.text
              }}>
                Email enviado
              </h3>
              <p style={{
                textAlign: 'center',
                color: C.textSub,
                fontSize: '0.875rem',
                lineHeight: '1.6',
                margin: '0 0 24px 0'
              }}>
                Si el email existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña.
              </p>
              <button
                onClick={() => router.push('/login')}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  background: C.navy,
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = C.navyBord}
                onMouseOut={(e) => e.currentTarget.style.background = C.navy}
              >
                Volver al Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{
                  color: C.textSub,
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  margin: '0 0 16px 0'
                }}>
                  Introduce tu email y te enviaremos instrucciones para recuperar tu contraseña.
                </p>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  marginBottom: '6px',
                  fontWeight: '500'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="tu@email.com"
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#333'}
                />
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#fca5a5',
                  fontSize: '0.82rem'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? '#1e3a5f' : C.navy,
                  color: loading ? '#475569' : '#fff',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s'
                }}
              >
                {loading ? 'Enviando...' : 'Enviar Instrucciones'}
              </button>
            </form>
          )}

          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            borderTop: '1px solid #1e1e1e',
            paddingTop: '20px'
          }}>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
              ¿Recordaste tu contraseña?{' '}
              <button
                onClick={() => router.push('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  padding: 0
                }}
              >
                Volver al login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
