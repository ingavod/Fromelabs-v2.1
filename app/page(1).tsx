'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import MessageBubble from './components/MessageBubble'
import SearchBar from './components/SearchBar'
import ImageUpload from './components/ImageUpload'
import DocumentUpload from './components/DocumentUpload'
import { processDocument, processImage } from './utils/fileUtils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

interface Conversation {
  id: string
  title: string
  createdAt: string
}

interface Usage {
  used: number
  limit: number
  plan: string
}

const C = {
  bg:        '#0a0a0a',
  surface:   '#111111',
  surface2:  '#1a1a1a',
  surface3:  '#222222',
  border:    '#2a2a2a',
  text:      '#f1f5f9',
  textMuted: '#64748b',
  textSub:   '#94a3b8',
  blue:      '#1d4ed8',
  blueSoft:  'rgba(29,78,216,0.15)',
  blueBord:  'rgba(29,78,216,0.35)',
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages]         = useState<Message[]>([])
  const [input, setInput]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [showHistory, setShowHistory]   = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [usage, setUsage]               = useState<Usage | null>(null)
  const [searchQuery, setSearchQuery]   = useState('')
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [sidebarOpen, setSidebarOpen]   = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const attachMenuRef  = useRef<HTMLDivElement>(null)
  const [attachMode, setAttachMode]     = useState<'file' | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') { loadUsage(); loadHistory() }
  }, [status])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const loadUsage = async () => {
    try {
      const res = await fetch('/api/chat?getUsage=true')
      const data = await res.json()
      if (data.usage) setUsage(data.usage)
    } catch {}
  }

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/chat?getHistory=true')
      const data = await res.json()
      if (data.conversations) setConversations(data.conversations)
    } catch {}
  }

  const loadConversation = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/chat?conversationId=${conversationId}`)
      const data = await res.json()
      if (data.messages) {
        setMessages(data.messages)
        setCurrentConversationId(conversationId)
        setShowHistory(false)
      }
    } catch {}
  }

  const newConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
    setShowHistory(false)
    setSelectedImage(null)
    setSelectedDocument(null)
    setShowAttachMenu(false)
    setAttachMode(null)
  }

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage && !selectedDocument) || loading) return

    const userMessage: Message = { role: 'user', content: input || '(Archivo adjunto)' }
    setMessages(prev => [...prev, userMessage])

    const currentInput    = input
    const currentImage    = selectedImage
    const currentDocument = selectedDocument

    setInput('')
    setSelectedImage(null)
    setSelectedDocument(null)
    setShowAttachMenu(false)
    setAttachMode(null)
    setLoading(true)

    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }])

    try {
      let imageData    = null
      let documentData = null
      if (currentImage)    imageData    = await processImage(currentImage.file)
      if (currentDocument) documentData = await processDocument(currentDocument)

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
          conversationId: currentConversationId,
          image: imageData,
          document: documentData,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessages(prev => prev.filter((_, i) => i !== prev.length - 1))
        if (res.status === 429) {
          alert(data.error)
          router.push('/account')
        } else {
          throw new Error(data.error || 'Error al enviar mensaje')
        }
        setLoading(false)
        return
      }

      const reader  = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No se pudo leer el stream')

      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          try {
            const parsed = JSON.parse(line.slice(6))
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.text) {
              accumulatedText += parsed.text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: accumulatedText, isStreaming: true }
                return updated
              })
            }
            if (parsed.done) {
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: accumulatedText, isStreaming: false }
                return updated
              })
              if (parsed.conversationId && !currentConversationId) setCurrentConversationId(parsed.conversationId)
              if (parsed.usage) setUsage(parsed.usage)
              loadHistory()
            }
          } catch {}
        }
      }
    } catch (error) {
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (status === 'loading') {
    return <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontFamily: 'system-ui' }}>Cargando...</div>
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, color: C.text, fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? '260px' : '52px', background: C.surface, borderRight: `1px solid ${C.border}`, transition: 'width 0.25s ease', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: '1rem', textAlign: 'left', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center' }}>
          {sidebarOpen ? '←' : '→'}
        </button>

        {sidebarOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '12px', gap: '6px' }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 4px', marginBottom: '8px' }}>
              <Image src="/logo-from-e.png" alt="From E Labs" width={36} height={36} style={{ display: 'block' }} />
            </div>

            {/* Nueva conversación */}
            <button onClick={newConversation}
              style={{ padding: '9px 14px', borderRadius: '7px', border: `1px solid ${C.border}`, background: 'transparent', color: C.text, cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.background = C.surface2)}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
              + Nueva conversación
            </button>

            {/* Historial */}
            <button onClick={() => setShowHistory(true)}
              style={{ padding: '9px 14px', borderRadius: '7px', border: 'none', background: 'transparent', color: C.textSub, cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left', transition: 'background 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.background = C.surface2)}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
              Historial
            </button>

            {/* Separador */}
            <div style={{ height: '1px', background: C.border, margin: '8px 0' }} />

            {/* Plan / uso */}
            {usage && (
              <button onClick={() => router.push('/account')}
                style={{ padding: '10px 14px', borderRadius: '7px', border: `1px solid ${C.border}`, background: C.surface2, color: C.textSub, cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', transition: 'background 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.background = C.surface3)}
                onMouseOut={e => (e.currentTarget.style.background = C.surface2)}>
                <div style={{ color: C.textMuted, fontSize: '0.72rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan {usage.plan}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{usage.used} / {usage.limit} mensajes</span>
                </div>
                <div style={{ marginTop: '6px', height: '3px', borderRadius: '2px', background: C.surface3 }}>
                  <div style={{ height: '100%', borderRadius: '2px', background: C.blue, width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }} />
                </div>
              </button>
            )}

            {/* Admin */}
            {(session?.user as { isAdmin?: boolean })?.isAdmin && (
              <button onClick={() => router.push('/admin/users')}
                style={{ padding: '9px 14px', borderRadius: '7px', border: 'none', background: 'transparent', color: C.textMuted, cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', transition: 'background 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.background = C.surface2)}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                Panel admin
              </button>
            )}

            {/* Salir */}
            <div style={{ marginTop: 'auto' }}>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                style={{ width: '100%', padding: '9px 14px', borderRadius: '7px', border: 'none', background: 'transparent', color: C.textMuted, cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' as const, transition: 'background 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.background = C.surface2)}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/logo-from-e.png" alt="From E Labs" width={32} height={32} style={{ display: 'block' }} />
            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: C.text }}>From E Labs</span>
          </div>
        </header>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: '800px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '20%', color: C.textMuted }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: C.textSub, marginBottom: '8px' }}>¿En qué puedo ayudarte?</div>
              <div style={{ fontSize: '0.85rem' }}>Escribe un mensaje o adjunta un archivo para comenzar</div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx}>
                <MessageBubble role={msg.role} content={msg.content} theme="dark" />
                {msg.isStreaming && (
                  <span style={{ display: 'inline-block', width: '7px', height: '16px', background: C.blue, marginLeft: '4px', borderRadius: '2px', animation: 'blink 1s infinite', verticalAlign: 'middle' }} />
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '16px 24px', flexShrink: 0 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Adjuntos activos */}
            {(attachMode === 'file' || selectedImage || selectedDocument) && (
              <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ImageUpload
                  onImageSelect={(file, preview) => setSelectedImage({ file, preview })}
                  onImageRemove={() => setSelectedImage(null)}
                  selectedImage={selectedImage}
                  theme="dark"
                />
                <DocumentUpload
                  onDocumentSelect={setSelectedDocument}
                  onDocumentRemove={() => setSelectedDocument(null)}
                  selectedDocument={selectedDocument}
                  theme="dark"
                />
              </div>
            )}

            <div style={{ position: 'relative', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>

              {/* Botón adjuntar con menú */}
              <div ref={attachMenuRef} style={{ position: 'relative', flexShrink: 0 }}>
                <button onClick={() => setShowAttachMenu(!showAttachMenu)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: `1px solid ${showAttachMenu ? '#3b82f6' : C.border}`, background: showAttachMenu ? C.blueSoft : C.surface2, color: showAttachMenu ? '#93c5fd' : C.textMuted, cursor: 'pointer', fontSize: '1rem', lineHeight: 1, transition: 'all 0.15s' }}
                  title="Adjuntar archivo">
                  +
                </button>

                {/* Menú desplegable */}
                {showAttachMenu && (
                  <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '6px', minWidth: '200px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 100 }}>
                    <button
                      onClick={() => { setAttachMode('file'); setShowAttachMenu(false) }}
                      style={{ width: '100%', padding: '9px 14px', borderRadius: '7px', border: 'none', background: 'transparent', color: C.text, cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.15s' }}
                      onMouseOver={e => (e.currentTarget.style.background = C.surface3)}
                      onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                      <span style={{ color: C.textMuted, fontSize: '1rem' }}>◻</span>
                      Añadir archivos o fotos
                    </button>
                  </div>
                )}
              </div>

              {/* Textarea */}
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                rows={1}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.surface2, color: C.text, fontSize: '0.9rem', resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: '1.5', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />

              {/* Enviar */}
              <button onClick={sendMessage}
                disabled={loading || (!input.trim() && !selectedImage && !selectedDocument)}
                style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: loading || (!input.trim() && !selectedImage && !selectedDocument) ? C.surface3 : C.blue, color: loading || (!input.trim() && !selectedImage && !selectedDocument) ? C.textMuted : '#fff', cursor: loading || (!input.trim() && !selectedImage && !selectedDocument) ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '0.85rem', flexShrink: 0, transition: 'background 0.15s' }}>
                {loading ? '...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal historial */}
      {showHistory && (
        <div onClick={() => setShowHistory(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(3px)' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px', maxWidth: '560px', width: '90%', maxHeight: '75vh', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Historial de conversaciones</h2>
              <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <SearchBar onSearch={setSearchQuery} theme="dark" placeholder="Buscar conversaciones..." />
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredConversations.length === 0 ? (
                <p style={{ color: C.textMuted, textAlign: 'center', padding: '20px', fontSize: '0.85rem' }}>
                  {searchQuery ? 'Sin resultados' : 'No hay conversaciones guardadas'}
                </p>
              ) : filteredConversations.map(conv => (
                <button key={conv.id} onClick={() => loadConversation(conv.id)}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.surface2, color: C.text, textAlign: 'left', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseOver={e => (e.currentTarget.style.background = C.surface3)}
                  onMouseOut={e => (e.currentTarget.style.background = C.surface2)}>
                  <div style={{ fontWeight: '500', fontSize: '0.88rem', marginBottom: '3px' }}>{conv.title}</div>
                  <div style={{ fontSize: '0.75rem', color: C.textMuted }}>
                    {new Date(conv.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
	textarea { color: #f1f5f9 !important; -webkit-text-fill-color: #f1f5f9 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a3a3a; }
      `}</style>
    </div>
  )
}
