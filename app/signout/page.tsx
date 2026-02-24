'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function SignOutPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', padding: '48px 24px' }}>
        <div style={{ display: 'inline-flex', background: '#111', border: '1px solid #222', padding: '20px', borderRadius: '16px', marginBottom: '32px' }}>
          <Image src="/logo-from-e.png" alt="From E Labs" width={80} height={80} style={{ display: 'block' }} />
        </div>

        <h1 style={{ margin: '0 0 16px', fontSize: '2rem', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          Sesión cerrada
        </h1>

        <p style={{ margin: '0 0 40px', color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Esperamos volver a verte pronto
        </p>

        <a href="/login" style={{ display: 'inline-block', padding: '14px 32px', background: isHovered ? '#1e40af' : '#1d4ed8', color: '#ffffff', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.2s', transform: isHovered ? 'translateY(-1px)' : 'translateY(0)' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          Volver a iniciar sesión
        </a>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #1e1e1e' }}>
          <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0 }}>
            From E System - Cognitive Counterpart
          </p>
        </div>
      </div>
    </div>
  )
}
