'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]       = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) setError('Email o contraseña incorrectos')
      else { router.push('/chat'); router.refresh() }
    } catch {
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: '#1e1e1e',
    border: '1px solid #333', borderRadius: '8px', color: '#f1f5f9',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '500',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>

        {/* Logo y título */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <Image src="/logo-frome40.png" alt="From E" width={160} height={53} style={{ display: 'block' }} />
          </div>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.85rem' }}>Inicia sesión para continuar</p>
        </div>

        {/* Card */}
        <div style={{ background: '#111111', border: '1px solid #222', borderRadius: '12px', padding: '28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={inputStyle} placeholder="tu@email.com"
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#333'} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={labelStyle}>Contraseña</label>
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  style={{ ...inputStyle, paddingRight: '40px' }} 
                  placeholder="••••••••••••"
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#333'} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#64748b'
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.82rem' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', background: isLoading ? '#1e3a5f' : '#1d4ed8', color: isLoading ? '#475569' : '#fff', fontWeight: '600', fontSize: '0.9rem', transition: 'background 0.2s' }}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #1e1e1e', paddingTop: '20px' }}>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
              ¿No tienes cuenta?{' '}
              <button onClick={() => router.push('/register')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', padding: 0 }}>
                Regístrate gratis
              </button>
            </p>
          </div>
        </div>

        {/* Frase legal con links */}
        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.72rem', marginTop: '20px', lineHeight: '1.5' }}>
          Al enviar un mensaje a FromE, un Cognitive Counterpart, aceptas nuestras{' '}
          <a href="/legal/condiciones" style={{ color: '#64748b', textDecoration: 'underline' }}>condiciones</a>, nuestra{' '}
          <a href="/legal/uso-aceptable" style={{ color: '#64748b', textDecoration: 'underline' }}>política de uso aceptable</a>{' '}
          y confirmas que has leído nuestra{' '}
          <a href="/legal/privacidad" style={{ color: '#64748b', textDecoration: 'underline' }}>política de privacidad</a>.
        </p>

        {/* Powered by Claude */}
        <div style={{ textAlign: 'center', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ color: '#475569', fontSize: '0.7rem' }}>Powered by</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" fill="#CC9B7A"/>
            <path d="M16.5 7.5C16.5 8.32843 15.8284 9 15 9C14.1716 9 13.5 8.32843 13.5 7.5C13.5 6.67157 14.1716 6 15 6C15.8284 6 16.5 6.67157 16.5 7.5Z" fill="#1F1F1F"/>
            <path d="M9 18C11.2091 18 13 16.2091 13 14C13 11.7909 11.2091 10 9 10C6.79086 10 5 11.7909 5 14C5 16.2091 6.79086 18 9 18Z" fill="#1F1F1F"/>
            <path d="M19 14C19 16.7614 16.7614 19 14 19C11.2386 19 9 16.7614 9 14C9 11.2386 11.2386 9 14 9C16.7614 9 19 11.2386 19 14Z" fill="#1F1F1F"/>
          </svg>
          <span style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: '600' }}>Claude</span>
        </div>
      </div>
    </div>
  )
}
