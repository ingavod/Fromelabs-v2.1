'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const result = await signIn('credentials', { 
        email, 
        password, 
        redirect: false 
      })
      if (result?.error) {
        setError('Email o contraseña incorrectos')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const C = {
    bg: '#0a0a0a',
    surface: '#111111',
    border: '#222222',
    text: '#f1f5f9',
    textMuted: '#64748b',
    textSub: '#94a3b8',
    blue: '#1d4ed8',
    inputBg: '#1e1e1e',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: '8px', borderRadius: '10px' }}>
              <Image src="/logo-from-e.png" alt="From E Labs" width={52} height={52} style={{ display: 'block' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: C.text }}>From E Labs</h1>
          </div>
          <p style={{ margin: '8px 0 0', color: C.textMuted, fontSize: '0.85rem' }}>Inicia sesión para continuar</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: C.textSub, marginBottom: '6px', fontWeight: '500' }}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                style={{ width: '100%', padding: '10px 14px', background: C.inputBg, border: `1px solid #333`, borderRadius: '8px', color: C.text, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                placeholder="tu@email.com"
                onFocus={e => e.currentTarget.style.borderColor = C.blue}
                onBlur={e => e.currentTarget.style.borderColor = '#333'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: C.textSub, marginBottom: '6px', fontWeight: '500' }}>Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                style={{ width: '100%', padding: '10px 14px', background: C.inputBg, border: `1px solid #333`, borderRadius: '8px', color: C.text, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                placeholder="••••••••••••"
                onFocus={e => e.currentTarget.style.borderColor = C.blue}
                onBlur={e => e.currentTarget.style.borderColor = '#333'}
              />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.82rem' }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', background: isLoading ? '#1e3a5f' : C.blue, color: isLoading ? '#475569' : '#fff', fontWeight: '600', fontSize: '0.9rem', transition: 'background 0.2s' }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', borderTop: `1px solid ${C.inputBg}`, paddingTop: '20px' }}>
            <p style={{ color: C.textMuted, fontSize: '0.82rem', margin: 0 }}>
              ¿No tienes cuenta?{' '}
              <button 
                onClick={() => router.push('/register')} 
                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', padding: 0 }}
              >
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
