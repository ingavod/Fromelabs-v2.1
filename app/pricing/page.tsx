'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

// Colores del sistema
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surface2: '#1a1a1a',
  border: '#2a2a2a',
  navy: '#1e40af',
  navyBord: '#2563eb',
  navyText: '#60a5fa',
  text: '#e5e5e5',
  textSub: '#a3a3a3',
  textMuted: '#737373',
}

// Configuración de países
const COUNTRIES = [
  { code: 'ES', name: 'España', flag: '🇪🇸', phonePrefix: '+34', phoneMask: '999 999 999', idLabel: 'DNI/NIE', idPlaceholder: '12345678A' },
  { code: 'US', name: 'United States', flag: '🇺🇸', phonePrefix: '+1', phoneMask: '(999) 999-9999', idLabel: 'SSN', idPlaceholder: '123-45-6789' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phonePrefix: '+44', phoneMask: '9999 999999', idLabel: 'National Insurance', idPlaceholder: 'AB123456C' },
  { code: 'FR', name: 'France', flag: '🇫🇷', phonePrefix: '+33', phoneMask: '9 99 99 99 99', idLabel: 'NIR', idPlaceholder: '1 23 45 67 890 123' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', phonePrefix: '+49', phoneMask: '999 99999999', idLabel: 'Steuer-ID', idPlaceholder: '12 345 678 901' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', phonePrefix: '+39', phoneMask: '999 9999999', idLabel: 'Codice Fiscale', idPlaceholder: 'RSSMRA80A01H501U' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', phonePrefix: '+52', phoneMask: '999 999 9999', idLabel: 'RFC', idPlaceholder: 'XAXX010101000' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', phonePrefix: '+54', phoneMask: '9 9999-9999', idLabel: 'DNI', idPlaceholder: '12.345.678' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', phonePrefix: '+55', phoneMask: '(99) 99999-9999', idLabel: 'CPF', idPlaceholder: '123.456.789-00' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', phonePrefix: '+1', phoneMask: '(999) 999-9999', idLabel: 'SIN', idPlaceholder: '123-456-789' },
]

const PLANS = [
  {
    id: 'PRO',
    name: 'Pro',
    price: '€19.99',
    period: 'por mes',
    messages: 500,
    features: [
      '500 mensajes mensuales',
      'From E Labs',
      'Historial ilimitado',
      'Soporte prioritario',
      'Adjuntar imágenes',
      'Analizar documentos',
    ],
    popular: true,
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: '€49.99',
    period: 'por mes',
    messages: 2000,
    features: [
      '2,000 mensajes mensuales',
      'From E Labs',
      'Historial ilimitado',
      'Soporte VIP',
      'Acceso anticipado',
      'Análisis avanzado',
    ],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: '€99.99',
    period: 'por mes',
    messages: 10000,
    features: [
      '10,000 mensajes mensuales',
      'From E Labs',
      'Historial ilimitado',
      'Soporte 24/7',
      'Integraciones personalizadas',
      'SLA garantizado',
    ],
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [showBillingModal, setShowBillingModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]) // España por defecto
  const [billingData, setBillingData] = useState({
    phone: '',
    identification: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({})

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'ENTERPRISE') {
      window.location.href = 'mailto:support@fromelabs.com?subject=Enterprise Plan'
      return
    }

    if (!session) {
      router.push('/login')
      return
    }

    // Abrir modal de facturación
    setSelectedPlan(planId)
    setShowBillingModal(true)
    setBillingErrors({})
  }

  const validateBillingData = (): boolean => {
    const errors: Record<string, string> = {}

    if (!billingData.phone.trim()) {
      errors.phone = 'Teléfono requerido'
    }
    if (!billingData.identification.trim()) {
      errors.identification = `${selectedCountry.idLabel} requerido`
    }
    if (!billingData.address.trim()) {
      errors.address = 'Dirección requerida'
    }
    if (!billingData.city.trim()) {
      errors.city = 'Ciudad requerida'
    }
    if (!billingData.postalCode.trim()) {
      errors.postalCode = 'Código postal requerido'
    }

    setBillingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleProceedToPayment = async () => {
    if (!validateBillingData() || !selectedPlan) return

    setLoading(selectedPlan)

    try {
      // Guardar datos de facturación con prefijo y país
      const updateRes = await fetch('/api/user/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...billingData,
          phone: `${selectedCountry.phonePrefix}${billingData.phone}`,
          country: selectedCountry.name,
        }),
      })

      if (!updateRes.ok) {
        alert('Error al guardar datos de facturación')
        setLoading(null)
        return
      }

      // Crear sesión de pago
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error al crear sesión de pago')
        setLoading(null)
      }
    } catch (error) {
      alert('Error al procesar el pago')
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        background: C.surface
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/logo-from-e.png" alt="Logo" width={36} height={36} />
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
              From E Labs
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '8px 16px',
                background: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: '6px',
                color: C.text,
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = C.border}
              onMouseOut={(e) => e.currentTarget.style.background = C.surface2}
            >
              Inicio
            </button>
            {session ? (
              <button
                onClick={() => router.push('/chat')}
                style={{
                  padding: '8px 16px',
                  background: C.navy,
                  border: 'none',
                  borderRadius: '6px',
                  color: C.text,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = C.navyBord}
                onMouseOut={(e) => e.currentTarget.style.background = C.navy}
              >
                Ir al Chat
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                style={{
                  padding: '8px 16px',
                  background: C.navy,
                  border: 'none',
                  borderRadius: '6px',
                  color: C.text,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = C.navyBord}
                onMouseOut={(e) => e.currentTarget.style.background = C.navy}
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 32px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          margin: '0 0 16px 0'
        }}>
          Planes y Precios
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: C.textSub,
          margin: 0
        }}>
          Elige el plan perfecto para ti
        </p>
      </div>

      {/* Plans Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px 64px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: C.surface,
              border: plan.popular ? `2px solid ${C.navy}` : `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '32px 24px',
              position: 'relative',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: C.navy,
                padding: '4px 16px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                POPULAR
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: '0 0 8px 0'
              }}>
                {plan.name}
              </h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 0 4px 0'
              }}>
                {plan.price}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: C.textMuted
              }}>
                {plan.period}
              </div>
            </div>

            <div style={{
              background: C.surface2,
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                {plan.messages.toLocaleString()} mensajes/mes
              </div>
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 24px 0'
            }}>
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    padding: '8px 0',
                    fontSize: '0.875rem',
                    color: C.textSub,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ color: C.navyText }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={loading === plan.id}
              style={{
                width: '100%',
                padding: '12px',
                background: plan.popular ? C.navy : C.surface2,
                border: plan.popular ? 'none' : `1px solid ${C.border}`,
                borderRadius: '8px',
                color: C.text,
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: loading === plan.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (loading !== plan.id) {
                  e.currentTarget.style.background = plan.popular ? C.navyBord : C.border
                }
              }}
              onMouseOut={(e) => {
                if (loading !== plan.id) {
                  e.currentTarget.style.background = plan.popular ? C.navy : C.surface2
                }
              }}
            >
              {loading === plan.id ? 'Procesando...' : 
               plan.id === 'ENTERPRISE' ? 'Contactar' :
               session ? 'Seleccionar Plan' : 'Iniciar Sesión'}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '64px 32px'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          textAlign: 'center',
          margin: '0 0 32px 0'
        }}>
          Preguntas Frecuentes
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <details style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            padding: '20px'
          }}>
            <summary style={{
              color: C.navyText,
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1.05rem'
            }}>
              ¿Puedo cancelar en cualquier momento?
            </summary>
            <p style={{
              color: C.textSub,
              marginTop: '12px',
              lineHeight: '1.6',
              margin: '12px 0 0 0'
            }}>
              Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de cuenta. No hay penalizaciones.
            </p>
          </details>

          <details style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            padding: '20px'
          }}>
            <summary style={{
              color: C.navyText,
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1.05rem'
            }}>
              ¿Qué pasa si alcanzo el límite?
            </summary>
            <p style={{
              color: C.textSub,
              marginTop: '12px',
              lineHeight: '1.6',
              margin: '12px 0 0 0'
            }}>
              Puedes actualizar tu plan en cualquier momento. Los mensajes se resetean cada mes.
            </p>
          </details>

          <details style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            padding: '20px'
          }}>
            <summary style={{
              color: C.navyText,
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1.05rem'
            }}>
              ¿Es seguro el pago?
            </summary>
            <p style={{
              color: C.textSub,
              marginTop: '12px',
              lineHeight: '1.6',
              margin: '12px 0 0 0'
            }}>
              Sí. Usamos Stripe, la plataforma de pagos más segura del mundo. No almacenamos datos de tarjetas.
            </p>
          </details>
        </div>
      </div>

      {/* Billing Modal */}
      {showBillingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: C.surface,
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: '0 0 24px 0'
            }}>
              Datos de Facturación
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Country Selector */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: C.textSub }}>
                  País *
                </label>
                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = COUNTRIES.find(c => c.code === e.target.value)
                    if (country) setSelectedCountry(country)
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: C.surface2,
                    border: `1px solid ${C.border}`,
                    borderRadius: '6px',
                    color: C.text,
                    fontSize: '0.875rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: C.textSub }}>
                  Teléfono *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    padding: '10px 12px',
                    background: C.surface2,
                    border: `1px solid ${C.border}`,
                    borderRadius: '6px',
                    color: C.textSub,
                    fontSize: '0.875rem',
                    minWidth: '70px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedCountry.phonePrefix}
                  </div>
                  <input
                    type="tel"
                    value={billingData.phone}
                    onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                    placeholder={selectedCountry.phoneMask.replace(/9/g, '0')}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      background: C.surface2,
                      border: billingErrors.phone ? '1px solid #ef4444' : `1px solid ${C.border}`,
                      borderRadius: '6px',
                      color: C.text,
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
                {billingErrors.phone && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', margin: '4px 0 0 0' }}>
                    {billingErrors.phone}
                  </p>
                )}
              </div>

              {/* ID */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: C.textSub }}>
                  {selectedCountry.idLabel} *
                </label>
                <input
                  type="text"
                  value={billingData.identification}
                  onChange={(e) => setBillingData({ ...billingData, identification: e.target.value })}
                  placeholder={selectedCountry.idPlaceholder}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: C.surface2,
                    border: billingErrors.identification ? '1px solid #ef4444' : `1px solid ${C.border}`,
                    borderRadius: '6px',
                    color: C.text,
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                {billingErrors.identification && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', margin: '4px 0 0 0' }}>
                    {billingErrors.identification}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: C.textSub }}>
                  Dirección *
                </label>
                <input
                  type="text"
                  value={billingData.address}
                  onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                  placeholder="Calle Principal 123"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: C.surface2,
                    border: billingErrors.address ? '1px solid #ef4444' : `1px solid ${C.border}`,
                    borderRadius: '6px',
                    color: C.text,
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                {billingErrors.address && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', margin: '4px 0 0 0' }}>
                    {billingErrors.address}
                  </p>
                )}
              </div>

              {/* City & Postal Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: C.textSub }}>
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={billingData.city}
                    onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                    placeholder="Madrid"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: C.surface2,
                      border: billingErrors.city ? '1px solid #ef4444' : `1px solid ${C.border}`,
                      borderRadius: '6px',
                      color: C.text,
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  {billingErrors.city && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', margin: '4px 0 0 0' }}>
                      {billingErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: C.textSub }}>
                    C.P. *
                  </label>
                  <input
                    type="text"
                    value={billingData.postalCode}
                    onChange={(e) => setBillingData({ ...billingData, postalCode: e.target.value })}
                    placeholder="28001"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: C.surface2,
                      border: billingErrors.postalCode ? '1px solid #ef4444' : `1px solid ${C.border}`,
                      borderRadius: '6px',
                      color: C.text,
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  {billingErrors.postalCode && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', margin: '4px 0 0 0' }}>
                      {billingErrors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={() => {
                    setShowBillingModal(false)
                    setSelectedPlan(null)
                    setBillingErrors({})
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: C.surface2,
                    border: `1px solid ${C.border}`,
                    borderRadius: '6px',
                    color: C.text,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={!!loading}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: loading ? C.border : C.navy,
                    border: 'none',
                    borderRadius: '6px',
                    color: C.text,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Procesando...' : 'Continuar al Pago'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        padding: '32px',
        textAlign: 'center'
      }}>
        <p style={{
          color: C.textMuted,
          fontSize: '0.875rem',
          margin: 0
        }}>
          © 2026 From E Labs. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
