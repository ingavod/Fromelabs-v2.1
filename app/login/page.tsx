'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: '#111', border: '1px solid #222', padding: '8px', borderRadius: '10px' }}>
              <Image src="/logo-from-e.png" alt="From E Labs" width={52} height={52} style={{ display: 'block' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#f1f5f9' }}>From E Labs</h1>
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
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                style={inputStyle} placeholder="••••••••••••"
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#333'} />
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

        <p style={{ textAlign: 'center', color: '#334155', fontSize: '0.72rem', marginTop: '20px' }}>
          Al iniciar sesión aceptas nuestros Términos de Servicio y Política de Privacidad
        </p>
      </div>
    </div>
  )
}
