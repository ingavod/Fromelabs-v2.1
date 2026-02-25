'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

const passwordRules = [
  { label: 'Mínimo 12 caracteres', test: (p: string) => p.length >= 12 },
  { label: 'Una mayúscula',        test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Una minúscula',        test: (p: string) => /[a-z]/.test(p) },
  { label: 'Un número',            test: (p: string) => /[0-9]/.test(p) },
  { label: 'Un carácter especial', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail]                     = useState('')
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName]                       = useState('')
  const [lastName, setLastName]               = useState('')
  const [error, setError]                     = useState('')
  const [isLoading, setIsLoading]             = useState(false)
  const [showRules, setShowRules]             = useState(false)

  const passwordValid = passwordRules.every(r => r.test(password))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('El nombre es obligatorio'); return }
    if (!lastName.trim()) { setError('Los apellidos son obligatorios'); return }
    if (!email.trim()) { setError('El email es obligatorio'); return }
    if (!passwordValid) { setError('La contraseña no cumple los requisitos de seguridad'); return }
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return }

    setIsLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name.trim(), lastName: lastName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al crear la cuenta')
        return
      }

      alert('¡Cuenta creada! Por favor revisa tu email para verificar tu cuenta.')
      router.push('/login')
    } catch {
      setError('Error al crear la cuenta')
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
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.85rem' }}>Crea tu cuenta para continuar</p>
        </div>

        {/* Card */}
        <div style={{ background: '#111111', border: '1px solid #222', borderRadius: '12px', padding: '28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={labelStyle}>Nombre <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} placeholder="Tu nombre"
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#333'} />
            </div>

            <div>
              <label style={labelStyle}>Apellidos <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required style={inputStyle} placeholder="Tus apellidos"
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#333'} />
            </div>

            <div>
              <label style={labelStyle}>Email <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="tu@email.com"
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#333'} />
            </div>

            <div>
              <label style={labelStyle}>Contraseña <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="password" value={password} required style={inputStyle} placeholder="Mínimo 12 caracteres"
                onChange={e => { setPassword(e.target.value); setShowRules(true) }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#333'} />
              {showRules && (
                <div style={{ marginTop: '10px', padding: '12px', background: '#161616', borderRadius: '8px', border: '1px solid #222', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {passwordRules.map(rule => {
                    const ok = rule.test(password)
                    return (
                      <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                        <span style={{ color: ok ? '#22c55e' : '#475569', fontWeight: '700', minWidth: 12 }}>{ok ? '✓' : '○'}</span>
                        <span style={{ color: ok ? '#86efac' : '#475569' }}>{rule.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Confirmar contraseña <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                style={{ ...inputStyle, borderColor: confirmPassword ? (confirmPassword === password ? '#166534' : '#7f1d1d') : '#333' }}
                placeholder="Repite tu contraseña"
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1d4ed8'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = confirmPassword ? (confirmPassword === password ? '#166534' : '#7f1d1d') : '#333'} />
              {confirmPassword && (
                <p style={{ marginTop: '5px', fontSize: '0.75rem', color: confirmPassword === password ? '#86efac' : '#fca5a5' }}>
                  {confirmPassword === password ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                </p>
              )}
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.82rem' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading || !passwordValid}
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', cursor: isLoading || !passwordValid ? 'not-allowed' : 'pointer', background: isLoading || !passwordValid ? '#1e3a5f' : '#1d4ed8', color: isLoading || !passwordValid ? '#475569' : '#fff', fontWeight: '600', fontSize: '0.9rem', transition: 'background 0.2s' }}>
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #1e1e1e', paddingTop: '20px' }}>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', padding: 0 }}>
                Inicia sesión
              </button>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#334155', fontSize: '0.72rem', marginTop: '20px' }}>
          Al crear una cuenta aceptas nuestros Términos de Servicio y Política de Privacidad
        </p>
      </div>
    </div>
  )
}
