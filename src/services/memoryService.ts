// src/services/memoryService.ts
import { prisma } from '@/lib/prisma'

interface Memory {
  id?: number
  userId: string
  memoryKey: string
  memoryValue: string
  memoryType?: string
  confidence?: number
  source?: string
  expiresAt?: Date
  metadata?: any
}

export class MemoryService {
  async saveMemory(memory: Memory): Promise<number> {
    const result = await prisma.$executeRaw`
      INSERT INTO user_memory (
        user_id, memory_key, memory_value, memory_type, 
        confidence, source, expires_at, metadata
      )
      VALUES (
        ${memory.userId}, 
        ${memory.memoryKey}, 
        ${memory.memoryValue}, 
        ${memory.memoryType || 'fact'},
        ${memory.confidence || 1.0}, 
        ${memory.source || null}, 
        ${memory.expiresAt || null}, 
        ${JSON.stringify(memory.metadata || {})}::jsonb
      )
      ON CONFLICT (user_id, memory_key) 
      DO UPDATE SET
        memory_value = EXCLUDED.memory_value,
        memory_type = EXCLUDED.memory_type,
        confidence = EXCLUDED.confidence,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `
    return result as number
  }

  async getMemory(userId: string, memoryKey: string): Promise<Memory | null> {
    const result = await prisma.$queryRaw<any[]>`
      SELECT * FROM user_memory 
      WHERE user_id = ${userId} AND memory_key = ${memoryKey}
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `
    if (result.length === 0) return null
    const row = result[0]
    return {
      id: row.id,
      userId: row.user_id,
      memoryKey: row.memory_key,
      memoryValue: row.memory_value,
      memoryType: row.memory_type,
      confidence: parseFloat(row.confidence),
      source: row.source,
      metadata: row.metadata
    }
  }

  async getAllMemories(userId: string, type?: string): Promise<Memory[]> {
    let query
    if (type) {
      query = await prisma.$queryRaw<any[]>`
        SELECT * FROM user_memory 
        WHERE user_id = ${userId} AND memory_type = ${type}
        AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
        ORDER BY updated_at DESC
      `
    } else {
      query = await prisma.$queryRaw<any[]>`
        SELECT * FROM user_memory 
        WHERE user_id = ${userId}
        AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
        ORDER BY updated_at DESC
      `
    }
    return query.map(row => ({
      id: row.id,
      userId: row.user_id,
      memoryKey: row.memory_key,
      memoryValue: row.memory_value,
      memoryType: row.memory_type,
      confidence: parseFloat(row.confidence),
      source: row.source,
      metadata: row.metadata
    }))
  }

  async searchMemory(userId: string, searchText: string): Promise<Memory[]> {
    const searchPattern = `%${searchText}%`
    const results = await prisma.$queryRaw<any[]>`
      SELECT * FROM user_memory 
      WHERE user_id = ${userId} 
      AND (memory_value ILIKE ${searchPattern} OR memory_key ILIKE ${searchPattern})
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      ORDER BY confidence DESC, updated_at DESC
      LIMIT 20
    `
    return results.map(row => ({
      id: row.id,
      userId: row.user_id,
      memoryKey: row.memory_key,
      memoryValue: row.memory_value,
      memoryType: row.memory_type,
      confidence: parseFloat(row.confidence),
      metadata: row.metadata
    }))
  }

  async deleteMemory(userId: string, memoryKey: string): Promise<boolean> {
    const result = await prisma.$executeRaw`
      DELETE FROM user_memory 
      WHERE user_id = ${userId} AND memory_key = ${memoryKey}
    `
    return result > 0
  }

  async savePreferences(userId: string, preferences: Record<string, any>): Promise<void> {
    await prisma.$executeRaw`
      INSERT INTO user_preferences (user_id, preferences)
      VALUES (${userId}, ${JSON.stringify(preferences)}::jsonb)
      ON CONFLICT (user_id) 
      DO UPDATE SET preferences = user_preferences.preferences || EXCLUDED.preferences
    `
  }

  async getPreferences(userId: string): Promise<Record<string, any>> {
    const result = await prisma.$queryRaw<any[]>`
      SELECT preferences FROM user_preferences WHERE user_id = ${userId}
    `
    return result.length > 0 ? result[0].preferences : {}
  }

  async buildContextForClaude(userId: string): Promise<string> {
    const memories = await this.getAllMemories(userId)
    const preferences = await this.getPreferences(userId)
    if (memories.length === 0 && Object.keys(preferences).length === 0) return ''
    
    let context = '\n\n<user_context>\n'
    const personalInfo = memories.filter(m => m.memoryType === 'personal')
    if (personalInfo.length > 0) {
      context += '<personal_info>\n'
      personalInfo.forEach(m => context += `- ${m.memoryKey}: ${m.memoryValue}\n`)
      context += '</personal_info>\n\n'
    }
    context += '</user_context>\n'
    return context
  }

  async extractAndSaveFromMessage(userId: string, message: string, conversationId?: string): Promise<void> {
    const nameMatch = message.match(/(?:me llamo|mi nombre es|soy)\s+([A-ZÁ-Ú][a-zá-ú]+(?:\s+[A-ZÁ-Ú][a-zá-ú]+)?)/i)
    if (nameMatch) {
      await this.saveMemory({
        userId, memoryKey: 'name', memoryValue: nameMatch[1],
        memoryType: 'personal', source: conversationId, confidence: 0.8
      })
    }
  }
}

export default MemoryService
