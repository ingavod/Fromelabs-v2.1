'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignOutPage() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        padding: '48px 32px',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{
          marginBottom: '48px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Image 
            src="/logo-frome40.png" 
            alt="From E" 
            width={200} 
            height={67}
          />
        </div>

        {/* Mensaje */}
        <div style={{
          background: '#111111',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          padding: '40px 32px'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#e5e5e5',
            marginBottom: '12px',
            margin: 0
          }}>
            Esperamos volver a verte pronto
          </h1>

          <p style={{
            color: '#a3a3a3',
            fontSize: '0.95rem',
            marginTop: '12px',
            marginBottom: '32px'
          }}>
            Has cerrado sesión correctamente
          </p>

          <button
            onClick={() => router.push('/login')}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: '#1e40af',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1e40af'}
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Footer */}
        <p style={{
          marginTop: '24px',
          color: '#737373',
          fontSize: '0.75rem'
        }}>
          © 2026 From E Labs. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
