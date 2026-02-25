// hooks/useMemory.ts
'use client'

import { useState, useCallback, useEffect } from 'react'

interface MemoryOptions {
  expiresInDays?: number
  type?: 'general' | 'preference' | 'context' | 'conversation'
}

export function useMemory() {
  const [memories, setMemories] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  /**
   * Cargar todas las memorias al inicio
   */
  useEffect(() => {
    loadAllMemories()
  }, [])

  /**
   * Cargar todas las memorias del usuario
   */
  const loadAllMemories = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/memory')
      
      if (response.ok) {
        const data = await response.json()
        setMemories(data.memories || {})
      }
    } catch (error) {
      console.error('Error loading memories:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Obtener una memoria específica
   */
  const get = useCallback(async (key: string): Promise<string | null> => {
    // Primero buscar en cache local
    if (memories[key]) {
      return memories[key]
    }

    // Si no está en cache, buscar en servidor
    try {
      const response = await fetch(`/api/memory?key=${encodeURIComponent(key)}`)
      
      if (response.ok) {
        const data = await response.json()
        return data.value
      }
    } catch (error) {
      console.error('Error getting memory:', error)
    }
    
    return null
  }, [memories])

  /**
   * Guardar una memoria
   */
  const set = useCallback(async (
    key: string, 
    value: string, 
    options?: MemoryOptions
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
          value,
          type: options?.type || 'general',
          expiresInDays: options?.expiresInDays
        })
      })

      if (response.ok) {
        // Actualizar cache local
        setMemories(prev => ({ ...prev, [key]: value }))
        return true
      }
    } catch (error) {
      console.error('Error setting memory:', error)
    }
    
    return false
  }, [])

  /**
   * Eliminar una memoria
   */
  const remove = useCallback(async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/memory?key=${encodeURIComponent(key)}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Actualizar cache local
        setMemories(prev => {
          const newMemories = { ...prev }
          delete newMemories[key]
          return newMemories
        })
        return true
      }
    } catch (error) {
      console.error('Error removing memory:', error)
    }
    
    return false
  }, [])

  /**
   * Limpiar todas las memorias (solo del cache local)
   */
  const clear = useCallback(() => {
    setMemories({})
  }, [])

  return {
    memories,
    loading,
    get,
    set,
    remove,
    clear,
    reload: loadAllMemories
  }
}

/**
 * Hook simplificado para usar una sola memoria
 */
export function useMemoryKey(key: string, defaultValue?: string) {
  const [value, setValue] = useState<string | null>(defaultValue || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadValue()
  }, [key])

  const loadValue = async () => {
    try {
      const response = await fetch(`/api/memory?key=${encodeURIComponent(key)}`)
      if (response.ok) {
        const data = await response.json()
        setValue(data.value || defaultValue || null)
      }
    } catch (error) {
      console.error('Error loading memory:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateValue = async (newValue: string) => {
    try {
      const response = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: newValue })
      })

      if (response.ok) {
        setValue(newValue)
        return true
      }
    } catch (error) {
      console.error('Error updating memory:', error)
    }
    return false
  }

  return {
    value,
    loading,
    setValue: updateValue,
    reload: loadValue
  }
}
