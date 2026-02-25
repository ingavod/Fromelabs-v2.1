'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

// Colores del sistema
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surface2: '#1a1a1a',
  border: '#2a2a2a',
  navy: '#1e40af',
  navyBord: '#2563eb',
  text: '#e5e5e5',
  textSub: '#a3a3a3',
  textMuted: '#737373',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
}

interface EconomicStats {
  totalRevenue: number
  monthlyRevenue: number
  estimatedCosts: number
  profit: number
  costEvolution: { date: string; cost: number }[]
  costThreshold: number
  isOverThreshold: boolean
  planDistribution: { 
    plan: string
    count: number
    monthlyRevenue: number
    annualProjection: number
  }[]
  recentPayments: { 
    date: string
    user: string
    plan: string
    amount: number
  }[]
}

export default function AnalisisEconomicoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<EconomicStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [newThreshold, setNewThreshold] = useState('')
  const [savingThreshold, setSavingThreshold] = useState(false)
  const [timeFilter, setTimeFilter] = useState('30') // días

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user && !session.user.isAdmin) {
      router.push('/')
      return
    }

    if (session?.user?.isAdmin) {
      fetchStats()
    }
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/economic-stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
        setNewThreshold(data.costThreshold.toString())
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveThreshold = async () => {
    const threshold = parseFloat(newThreshold)
    if (isNaN(threshold) || threshold < 0) {
      alert('Introduce un valor válido')
      return
    }

    setSavingThreshold(true)
    try {
      const res = await fetch('/api/admin/cost-threshold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          threshold,
          currentCost: stats?.estimatedCosts || 0
        }),
      })

      if (res.ok) {
        await fetchStats()
        alert('Umbral actualizado correctamente')
      } else {
        alert('Error al actualizar umbral')
      }
    } catch (error) {
      alert('Error al guardar')
    } finally {
      setSavingThreshold(false)
    }
  }

  if (loading || !session) {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: C.textSub }}>Cargando...</div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`
  const formatNumber = (num: number) => num.toLocaleString('es-ES')

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        background: C.surface
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Image src="/logo-from-e.png" alt="From E Labs" width={48} height={48} />
              <div>
                <h1 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '600' }}>
                  Análisis Económico
                </h1>
                <p style={{ margin: 0, color: C.textSub, fontSize: '0.875rem' }}>
                  Ingresos, costes y previsiones de From E Labs
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => router.push('/admin')}
                style={{
                  padding: '8px 16px',
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: '6px',
                  color: C.text,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = C.border}
                onMouseOut={(e) => e.currentTarget.style.background = C.surface2}
              >
                ← Volver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px'
      }}>
        {stats && (
          <>
            {/* Main Metrics - Diseño mejorado */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {/* Ingresos Totales */}
              <div style={{
                background: `linear-gradient(135deg, ${C.surface} 0%, ${C.surface2} 100%)`,
                border: `1px solid ${C.border}`,
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, ${C.green}15 0%, transparent 70%)`,
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  fontSize: '0.875rem',
                  color: C.textSub,
                  marginBottom: '12px',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>
                  INGRESOS TOTALES
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: C.green,
                  letterSpacing: '-0.5px',
                  marginBottom: '8px'
                }}>
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: C.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: C.green
                  }}></span>
                  Acumulado histórico
                </div>
              </div>

              {/* Ingresos Mensuales */}
              <div style={{
                background: `linear-gradient(135deg, ${C.surface} 0%, ${C.surface2} 100%)`,
                border: `1px solid ${C.border}`,
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, ${C.green}15 0%, transparent 70%)`,
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  fontSize: '0.875rem',
                  color: C.textSub,
                  marginBottom: '12px',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>
                  INGRESOS MENSUALES
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: C.green,
                  letterSpacing: '-0.5px',
                  marginBottom: '8px'
                }}>
                  {formatCurrency(stats.monthlyRevenue)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: C.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: C.green
                  }}></span>
                  Suscripciones activas
                </div>
              </div>

              {/* Costes API */}
              <div style={{
                background: stats.isOverThreshold 
                  ? `linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, ${C.surface2} 100%)`
                  : `linear-gradient(135deg, ${C.surface} 0%, ${C.surface2} 100%)`,
                border: `1px solid ${stats.isOverThreshold ? C.red : C.border}`,
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {stats.isOverThreshold && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: C.red,
                    color: C.text,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    boxShadow: `0 4px 12px ${C.red}40`
                  }}>
                    ⚠️ ALERTA
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, ${stats.isOverThreshold ? C.red : C.yellow}15 0%, transparent 70%)`,
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  fontSize: '0.875rem',
                  color: C.textSub,
                  marginBottom: '12px',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>
                  COSTES API CLAUDE
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: stats.isOverThreshold ? C.red : C.yellow,
                  letterSpacing: '-0.5px',
                  marginBottom: '8px'
                }}>
                  {formatCurrency(stats.estimatedCosts)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: C.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: stats.isOverThreshold ? C.red : C.yellow
                  }}></span>
                  Umbral: {formatCurrency(stats.costThreshold)}
                </div>
              </div>

              {/* Beneficio Neto */}
              <div style={{
                background: stats.profit > 0
                  ? `linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, ${C.surface2} 100%)`
                  : `linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, ${C.surface2} 100%)`,
                border: `2px solid ${stats.profit > 0 ? C.green : C.red}`,
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: stats.profit > 0 
                  ? `0 8px 24px ${C.green}20`
                  : `0 8px 24px ${C.red}20`
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, ${stats.profit > 0 ? C.green : C.red}20 0%, transparent 70%)`,
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  fontSize: '0.875rem',
                  color: stats.profit > 0 ? C.green : C.red,
                  marginBottom: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {stats.profit > 0 ? '↗' : '↘'} BENEFICIO NETO
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: stats.profit > 0 ? C.green : C.red,
                  letterSpacing: '-0.5px',
                  marginBottom: '8px'
                }}>
                  {formatCurrency(stats.profit)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: C.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: stats.profit > 0 ? C.green : C.red
                  }}></span>
                  {stats.profit > 0 ? 'Rentable' : 'En negativo'}
                </div>
              </div>
            </div>

            {/* Time Filters */}
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: C.textSub,
                fontWeight: '600'
              }}>
                Período de análisis:
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {[
                  { label: '1 día', value: '1' },
                  { label: '7 días', value: '7' },
                  { label: '30 días', value: '30' },
                  { label: '90 días', value: '90' },
                  { label: '180 días', value: '180' },
                  { label: '1 año', value: '365' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTimeFilter(filter.value)}
                    style={{
                      padding: '8px 16px',
                      background: timeFilter === filter.value ? C.navy : C.surface2,
                      border: timeFilter === filter.value ? 'none' : `1px solid ${C.border}`,
                      borderRadius: '6px',
                      color: C.text,
                      fontSize: '0.875rem',
                      fontWeight: timeFilter === filter.value ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (timeFilter !== filter.value) {
                        e.currentTarget.style.background = C.border
                      }
                    }}
                    onMouseOut={(e) => {
                      if (timeFilter !== filter.value) {
                        e.currentTarget.style.background = C.surface2
                      }
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Evolution & Threshold Configuration */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {/* Cost Evolution Chart */}
              <div style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  Evolución del Coste API
                </h2>
                <div style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  padding: '0 0 20px 0',
                  borderBottom: `1px solid ${C.border}`
                }}>
                  {stats.costEvolution.map((item, index) => {
                    const maxCost = Math.max(...stats.costEvolution.map(i => i.cost))
                    const height = maxCost > 0 ? (item.cost / maxCost) * 100 : 0
                    const isOverThreshold = item.cost > stats.costThreshold

                    return (
                      <div key={index} style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '100%',
                          height: `${height}%`,
                          minHeight: '4px',
                          background: isOverThreshold ? C.red : C.navy,
                          borderRadius: '4px 4px 0 0',
                          position: 'relative'
                        }}>
                          {isOverThreshold && (
                            <div style={{
                              position: 'absolute',
                              top: '-20px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontSize: '12px'
                            }}>
                              ⚠️
                            </div>
                          )}
                        </div>
                        <div style={{
                          fontSize: '0.7rem',
                          color: C.textMuted,
                          transform: 'rotate(-45deg)',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.date}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {stats.costThreshold > 0 && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '0.75rem',
                    color: C.textSub,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '3px',
                      background: C.red
                    }}></div>
                    Umbral de alerta: {formatCurrency(stats.costThreshold)}
                  </div>
                )}
              </div>

              {/* Threshold Configuration */}
              <div style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h2 style={{
                  margin: '0 0 16px 0',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  Configurar Alerta
                </h2>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      color: C.textSub,
                      marginBottom: '8px'
                    }}>
                      Umbral de coste (€/mes)
                    </label>
                    <input
                      type="number"
                      value={newThreshold}
                      onChange={(e) => setNewThreshold(e.target.value)}
                      placeholder="100.00"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: C.surface2,
                        border: `1px solid ${C.border}`,
                        borderRadius: '6px',
                        color: C.text,
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSaveThreshold}
                    disabled={savingThreshold}
                    style={{
                      padding: '10px',
                      background: savingThreshold ? C.border : C.navy,
                      border: 'none',
                      borderRadius: '6px',
                      color: C.text,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: savingThreshold ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (!savingThreshold) e.currentTarget.style.background = C.navyBord
                    }}
                    onMouseOut={(e) => {
                      if (!savingThreshold) e.currentTarget.style.background = C.navy
                    }}
                  >
                    {savingThreshold ? 'Guardando...' : 'Guardar Umbral'}
                  </button>
                  <div style={{
                    padding: '12px',
                    background: stats.isOverThreshold ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    border: `1px solid ${stats.isOverThreshold ? C.red : C.green}`,
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: stats.isOverThreshold ? C.red : C.green,
                    textAlign: 'center'
                  }}>
                    {stats.isOverThreshold ? '⚠️ Umbral superado' : '✓ Dentro del límite'}
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Projection by Plan */}
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Previsión de Ingresos por Plan
              </h2>
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                {stats.planDistribution.map((item) => (
                  <div
                    key={item.plan}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 100px 150px 150px',
                      gap: '16px',
                      alignItems: 'center',
                      padding: '16px',
                      background: C.surface2,
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{
                      fontWeight: '600',
                      color: C.navy
                    }}>
                      {item.plan}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: C.textSub
                    }}>
                      {item.count} usuarios
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: C.text
                    }}>
                      {formatCurrency(item.monthlyRevenue)}/mes
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: C.green,
                      textAlign: 'right'
                    }}>
                      {formatCurrency(item.annualProjection)}/año
                    </div>
                  </div>
                ))}
                {/* Total */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 100px 150px 150px',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '16px',
                  background: C.navy,
                  borderRadius: '8px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    fontWeight: '700'
                  }}>
                    TOTAL
                  </div>
                  <div></div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {formatCurrency(stats.planDistribution.reduce((sum, p) => sum + p.monthlyRevenue, 0))}/mes
                  </div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    textAlign: 'right'
                  }}>
                    {formatCurrency(stats.planDistribution.reduce((sum, p) => sum + p.annualProjection, 0))}/año
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            {stats.recentPayments.length > 0 && (
              <div style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  Pagos Recientes
                </h2>
                <div style={{
                  display: 'grid',
                  gap: '12px'
                }}>
                  {stats.recentPayments.map((payment, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr 100px 120px',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '12px',
                        background: C.surface2,
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <div style={{ color: C.textSub }}>
                        {payment.date}
                      </div>
                      <div>{payment.user}</div>
                      <div style={{ color: C.navy, fontWeight: '600' }}>
                        {payment.plan}
                      </div>
                      <div style={{
                        textAlign: 'right',
                        color: C.green,
                        fontWeight: '600'
                      }}>
                        {formatCurrency(payment.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
