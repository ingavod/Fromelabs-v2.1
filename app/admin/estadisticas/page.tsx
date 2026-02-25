'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type Range = '1D' | '7D' | '30D' | '90D' | '180D' | '1A'

interface Stats {
  range: string
  metrics: {
    totalUsers: number
    activeUsers: number
    blockedUsers: number
    adminUsers: number
    recentlyActiveUsers: number
    totalMessages: number
    totalConversations: number
    newUsersInRange: number
    messagesInRange: number
    avgMessagesPerUser: number
    avgMessagesPerConversation: number
    retentionRate: number
  }
  charts: {
    newUsersByDay: Array<{ date: string; value: number; label: string }>
    messagesByDay: Array<{ date: string; value: number; label: string }>
    planDistribution: Array<{ name: string; value: number; percentage: string }>
    apiCost: {
      total: number
      totalTokens: number
      totalRequests: number
      avgCostPerRequest: number
    }
  }
}

const PLAN_COLORS: Record<string, string> = {
  'FREE': '#6b7280',
  'PRO': '#1e40af',
  'PREMIUM': '#a855f7',
  'ENTERPRISE': '#7c3aed',
}

export default function EstadisticasPage() {
  const [range, setRange] = useState<Range>('30D')
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ranges: Array<{ value: Range; label: string }> = [
    { value: '1D', label: '1 día' },
    { value: '7D', label: '7 días' },
    { value: '30D', label: '30 días' },
    { value: '90D', label: '90 días' },
    { value: '180D', label: '180 días' },
    { value: '1A', label: '1 año' },
  ]

  useEffect(() => {
    loadStats()
  }, [range])

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/stats?range=${range}`)
      if (!res.ok) {
        throw new Error('Error al cargar estadísticas')
      }
      const data = await res.json()
      setStats(data)
    } catch (error: any) {
      console.error('Error cargando estadísticas:', error)
      setError(error.message || 'Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/logo-from-e.png" 
              alt="Frome Labs" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-2xl font-semibold">Estadísticas</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Cargando datos...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/logo-from-e.png" 
              alt="Frome Labs" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-2xl font-semibold">Estadísticas</h1>
          </div>
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
            <div className="text-red-400">
              {error || 'Error al cargar estadísticas. Por favor, verifica que la API esté funcionando.'}
            </div>
            <button
              onClick={loadStats}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img 
              src="/logo-from-e.png" 
              alt="Frome Labs" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-semibold">Estadísticas</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Selector de rango */}
            <div className="flex gap-2 bg-[#1a1a1a] p-1 rounded-lg border border-gray-800">
            {ranges.map(r => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${range === r.value 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                  }
                `}
              >
                {r.label}
              </button>
            ))}
          </div>
          
          {/* Botón Volver */}
          <button
            onClick={() => window.location.href = '/admin'}
            className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 hover:bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors"
          >
            ← Volver
          </button>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard 
            label="Total Usuarios" 
            value={stats?.metrics?.totalUsers?.toLocaleString() || '0'}
            subtitle="Registrados en total"
          />
          <MetricCard 
            label="Usuarios Activos" 
            value={stats?.metrics?.activeUsers?.toLocaleString() || '0'}
            subtitle="Con acceso habilitado"
          />
          <MetricCard 
            label="Activos Recientes" 
            value={stats?.metrics?.recentlyActiveUsers?.toLocaleString() || '0'}
            subtitle="Últimos 7 días"
            highlight
          />
          <MetricCard 
            label="Tasa de Retención" 
            value={`${stats?.metrics?.retentionRate || 0}%`}
            subtitle="Usuarios que regresan"
            highlight
          />
        </div>

        {/* Métricas de crecimiento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard 
            label="Nuevos Usuarios" 
            value={stats?.metrics?.newUsersInRange?.toLocaleString() || '0'}
            subtitle={`Últimos ${ranges.find(r => r.value === range)?.label}`}
          />
          <MetricCard 
            label="Mensajes Enviados" 
            value={stats?.metrics?.messagesInRange?.toLocaleString() || '0'}
            subtitle={`Últimos ${ranges.find(r => r.value === range)?.label}`}
          />
          <MetricCard 
            label="Total Mensajes" 
            value={stats?.metrics?.totalMessages?.toLocaleString() || '0'}
            subtitle="Histórico completo"
          />
          <MetricCard 
            label="Conversaciones" 
            value={stats?.metrics?.totalConversations?.toLocaleString() || '0'}
            subtitle="Total creadas"
          />
          <MetricCard 
            label="Usuarios Bloqueados" 
            value={stats?.metrics?.blockedUsers?.toLocaleString() || '0'}
            subtitle="Sin acceso"
          />
        </div>

        {/* KPIs y promedios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricCard 
            label="Mensajes por Usuario" 
            value={(stats?.metrics?.avgMessagesPerUser || 0).toFixed(1)}
            subtitle="Promedio general"
            highlight
          />
          <MetricCard 
            label="Mensajes por Conversación" 
            value={(stats?.metrics?.avgMessagesPerConversation || 0).toFixed(1)}
            subtitle="Promedio de intercambios"
            highlight
          />
          <MetricCard 
            label="Administradores" 
            value={stats?.metrics?.adminUsers?.toLocaleString() || '0'}
            subtitle="Con rol ADMIN"
          />
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Usuarios nuevos por día */}
          <ChartCard title="Nuevos Usuarios">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats?.charts?.newUsersByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis 
                  dataKey="label" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1a1a1a', 
                    border: '1px solid #2a2a2a', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={false}
                  name="Usuarios"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 2. Mensajes enviados por día */}
          <ChartCard title="Mensajes Enviados">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats?.charts?.messagesByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis 
                  dataKey="label" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1a1a1a', 
                    border: '1px solid #2a2a2a', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Mensajes"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 3. Distribución de planes */}
          <ChartCard title="Distribución de Planes">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats?.charts?.planDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name} (${entry.percentage}%)`}
                  labelLine={{ stroke: '#6b7280' }}
                >
                  {(stats?.charts?.planDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PLAN_COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#1a1a1a', 
                    border: '1px solid #2a2a2a', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 4. Coste API estimado */}
          <ChartCard title="Coste API Estimado">
            <div className="p-6 h-[280px] flex flex-col justify-center gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-2">Coste Total</div>
                <div className="text-4xl font-bold text-white">
                  ${(stats?.charts?.apiCost?.total || 0).toFixed(2)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Tokens Usados</div>
                  <div className="text-xl font-semibold text-gray-200">
                    {(stats?.charts?.apiCost?.totalTokens || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Requests</div>
                  <div className="text-xl font-semibold text-gray-200">
                    {(stats?.charts?.apiCost?.totalRequests || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-400 mb-1">Coste promedio por request</div>
                <div className="text-lg font-medium text-blue-400">
                  ${(stats?.charts?.apiCost?.avgCostPerRequest || 0).toFixed(4)}
                </div>
              </div>
            </div>
          </ChartCard>

        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, subtitle, highlight }: { 
  label: string
  value: string
  subtitle?: string
  highlight?: boolean
}) {
  return (
    <div className={`
      bg-[#1a1a1a] border rounded-lg p-5
      ${highlight ? 'border-blue-600/30 bg-blue-950/10' : 'border-gray-800'}
    `}>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
      <h3 className="text-base font-semibold text-white mb-4">
        {title}
      </h3>
      {children}
    </div>
  )
}
