'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

const passwordRules = [
  { label: 'Mínimo 12 caracteres', test: (p: string) => p.length >= 12 },
  { label: 'Una mayúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Una minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Un número', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Un carácter especial', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showRules, setShowRules] = useState(false)

  const passwordValid = passwordRules.every(r => r.test(password))

  useEffect(() => {
    if (!token) {
      setError('Token no válido')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordValid) {
      setError('La contraseña no cumple los requisitos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.error || 'Error al restablecer la contraseña')
      }
    } catch {
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
            Nueva contraseña
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
                Contraseña actualizada
              </h3>
              <p style={{
                textAlign: 'center',
                color: C.textSub,
                fontSize: '0.875rem',
                lineHeight: '1.6',
                margin: '0 0 8px 0'
              }}>
                Tu contraseña ha sido actualizada correctamente.
              </p>
              <p style={{
                textAlign: 'center',
                color: C.textSub,
                fontSize: '0.75rem',
                margin: 0
              }}>
                Redirigiendo al login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  marginBottom: '6px',
                  fontWeight: '500'
                }}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setShowRules(true) }}
                  required
                  style={inputStyle}
                  placeholder="Mínimo 12 caracteres"
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#333'}
                />
                {showRules && (
                  <div style={{
                    marginTop: '10px',
                    padding: '12px',
                    background: '#161616',
                    borderRadius: '8px',
                    border: '1px solid #222',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                  }}>
                    {passwordRules.map(rule => {
                      const ok = rule.test(password)
                      return (
                        <div key={rule.label} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.78rem'
                        }}>
                          <span style={{
                            color: ok ? '#22c55e' : '#475569',
                            fontWeight: '700',
                            minWidth: 12
                          }}>
                            {ok ? '✓' : '○'}
                          </span>
                          <span style={{ color: ok ? '#86efac' : '#475569' }}>
                            {rule.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  marginBottom: '6px',
                  fontWeight: '500'
                }}>
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    ...inputStyle,
                    borderColor: confirmPassword ? (confirmPassword === password ? '#166534' : '#7f1d1d') : '#333'
                  }}
                  placeholder="Repite tu contraseña"
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = confirmPassword ? (confirmPassword === password ? '#166534' : '#7f1d1d') : '#333'}
                />
                {confirmPassword && (
                  <p style={{
                    marginTop: '5px',
                    fontSize: '0.75rem',
                    color: confirmPassword === password ? '#86efac' : '#fca5a5',
                    margin: '5px 0 0 0'
                  }}>
                    {confirmPassword === password ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                  </p>
                )}
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
                disabled={loading || !passwordValid}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading || !passwordValid ? 'not-allowed' : 'pointer',
                  background: loading || !passwordValid ? '#1e3a5f' : C.navy,
                  color: loading || !passwordValid ? '#475569' : '#fff',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s'
                }}
              >
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
