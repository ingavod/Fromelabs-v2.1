'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CanceledPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '3rem',
        maxWidth: '600px',
        width: '100%',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '2rem' }}>
          <Image 
            src="/logo-from-e.png" 
            alt="From E Labs Logo" 
            width={80} 
            height={80}
            style={{ margin: '0 auto' }}
          />
        </div>

        {/* Cancel Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          border: '3px solid #ef4444'
        }}>
          <span style={{ fontSize: '3rem', color: '#ef4444' }}>✕</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '1rem'
        }}>
          Pago Cancelado
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          Has cancelado el proceso de pago. No te preocupes, puedes intentarlo de nuevo cuando quieras.
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => router.push('/pricing')}
            style={{
              padding: '14px 32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)',
              border: 'none',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 206, 209, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 206, 209, 0.6)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 206, 209, 0.4)'
            }}
          >
            Ver Planes
          </button>

          <button
            onClick={() => router.push('/chat')}
            style={{
              padding: '14px 32px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            }}
          >
            Volver al Chat
          </button>
        </div>

        {/* Help Text */}
        <p style={{
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.5)',
          marginTop: '2rem'
        }}>
          ¿Necesitas ayuda? Contacta con soporte en{' '}
          <a 
            href="mailto:support@fromelabs.com"
            style={{
              color: '#00CED1',
              textDecoration: 'none'
            }}
          >
            support@fromelabs.com
          </a>
        </p>
      </div>
    </div>
  )
}
