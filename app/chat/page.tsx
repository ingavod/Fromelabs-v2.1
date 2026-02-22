'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { exportAsText, exportAsMarkdown, exportAsJSON } from '@/lib/export-utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  projectId: string | null
  createdAt: string
  updatedAt: string
}

interface Project {
  id: string
  name: string
  _count: { conversations: number }
}

interface AttachedFile {
  id: string
  name: string
  type: 'image' | 'document'
  data: string
  content?: string
}

export default function ChatPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [projects, setProjects] = useState<Project[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentProjectId, setCurrentProjectId] = useState<string>('all')
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [currentConversationTitle, setCurrentConversationTitle] = useState<string>('')

  const [usage, setUsage] = useState({ used: 0, limit: 50, plan: 'FREE' })
  const [searchQuery, setSearchQuery] = useState('')
  const [messageSearchQuery, setMessageSearchQuery] = useState('')

  const [showSidebar, setShowSidebar] = useState(true)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProjects()
    loadConversations()
    loadUsage()
  }, [])

  useEffect(() => {
    loadConversations()
  }, [currentProjectId, searchQuery])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/chat?action=projects')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const loadConversations = async () => {
    try {
      let url = `/api/chat?action=conversations`
      if (currentProjectId !== 'all') {
        url += `&projectId=${currentProjectId}`
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`
      }

      const res = await fetch(url)
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const loadUsage = async () => {
    try {
      const res = await fetch('/api/chat?action=usage')
      const data = await res.json()
      setUsage(data.usage)
    } catch (error) {
      console.error('Error loading usage:', error)
    }
  }

  const loadConversation = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/chat?action=messages&conversationId=${conversationId}`)
      const data = await res.json()
      setMessages(data.messages || [])
      setCurrentConversationId(conversationId)

      const conv = conversations.find(c => c.id === conversationId)
      if (conv) {
        setCurrentConversationTitle(conv.title)
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const handleRenameConversation = async () => {
    if (!currentConversationId || !editedTitle.trim()) return

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'renameConversation',
          conversationId: currentConversationId,
          title: editedTitle.trim(),
        }),
      })

      if (res.ok) {
        setCurrentConversationTitle(editedTitle.trim())
        setIsEditingTitle(false)
        await loadConversations()
      }
    } catch (error) {
      console.error('Error renaming conversation:', error)
    }
  }

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createProject',
          name: newProjectName,
        }),
      })

      if (res.ok) {
        setNewProjectName('')
        setShowProjectModal(false)
        await loadProjects()
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('¿Eliminar este proyecto? Las conversaciones se mantendrán sin proyecto.')) return

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteProject',
          projectId,
        }),
      })
      await loadProjects()
      if (currentProjectId === projectId) {
        setCurrentProjectId('all')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm('¿Eliminar esta conversación?')) return

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteConversation',
          conversationId,
        }),
      })
      await loadConversations()
      if (currentConversationId === conversationId) {
        handleNewChat()
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const processFiles = async (files: FileList): Promise<AttachedFile[]> => {
    const fileArray = Array.from(files)
    const processed: AttachedFile[] = []

    for (const file of fileArray) {
      if (file.type.startsWith('image/')) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })
        processed.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'image',
          data: dataUrl,
        })
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const content = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsText(file)
        })
        processed.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'document',
          data: '',
          content,
        })
      }
    }

    return processed
  }

  const handleFilesSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const newFiles = await processFiles(files)
    setAttachedFiles(prev => [...prev, ...newFiles])
    setShowAttachMenu(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFilesSelect(e.dataTransfer.files)
    }
  }

  const removeAttachedFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const currentFiles = [...attachedFiles]
    setAttachedFiles([])

    abortControllerRef.current = new AbortController()

    try {
      const firstImage = currentFiles.find(f => f.type === 'image')
      const firstDoc = currentFiles.find(f => f.type === 'document')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          messages: newMessages,
          conversationId: currentConversationId,
          projectId: currentProjectId !== 'all' ? currentProjectId : null,
          image: firstImage ? { data: firstImage.data, type: firstImage.data.split(':')[1].split(';')[0] } : null,
          document: firstDoc ? { name: firstDoc.name, content: firstDoc.content } : null,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al enviar mensaje')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      if (reader) {
        setMessages([...newMessages, { role: 'assistant', content: '' }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.text) {
                  assistantMessage += data.text
                  setMessages([...newMessages, { role: 'assistant', content: assistantMessage }])
                }

                if (data.done) {
                  setCurrentConversationId(data.conversationId)
                  setUsage(data.usage)
                  await loadConversations()
                }

                if (data.error) {
                  throw new Error(data.error)
                }
              } catch (err) {
                // Ignore
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error)
        alert(error.message || 'Error al enviar mensaje')
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleStopGeneration = () => {
    abortControllerRef.current?.abort()
    setLoading(false)
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentConversationId(null)
    setCurrentConversationTitle('')
    setAttachedFiles([])
    setMessageSearchQuery('')
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleExportConversation = (format: 'txt' | 'md' | 'json') => {
    const title = currentConversationTitle || 'Conversación'
    if (format === 'txt') exportAsText(messages, title)
    else if (format === 'md') exportAsMarkdown(messages, title)
    else exportAsJSON(messages, title)
    setShowExportMenu(false)
  }

  const filteredMessages = messageSearchQuery
    ? messages.filter(m => m.content.toLowerCase().includes(messageSearchQuery.toLowerCase()))
    : messages

  const usagePercentage = usage ? (usage.used / usage.limit) * 100 : 0

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {showSidebar && (
        <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo-from-e.png" alt="Logo" width={28} height={28} />
              <span className="font-medium text-sm">From E Labs</span>
            </div>
            <button onClick={handleNewChat} className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium">Nueva conversación</button>
          </div>

          <div className="p-3 border-b border-gray-800">
            <input type="text" placeholder="Buscar conversaciones..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-700" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400 uppercase">Proyectos</span>
                <button onClick={() => setShowProjectModal(true)} className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
              <button onClick={() => setCurrentProjectId('all')} className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${currentProjectId === 'all' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}>Todas las conversaciones</button>
              {projects.map((project) => (
                <div key={project.id} className="group relative">
                  <button onClick={() => setCurrentProjectId(project.id)} className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${currentProjectId === project.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}>
                    <div className="flex items-center justify-between">
                      <span className="truncate">{project.name}</span>
                      <span className="text-xs text-gray-500">{project._count.conversations}</span>
                    </div>
                  </button>
                  <button onClick={() => handleDeleteProject(project.id)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-800">
              <div className="text-xs font-medium text-gray-400 uppercase mb-2">Conversaciones</div>
              {conversations.map((conv) => (
                <div key={conv.id} className="group relative">
                  <button onClick={() => loadConversation(conv.id)} className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${currentConversationId === conv.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}>
                    <div className="truncate pr-6">{conv.title}</div>
                    <div className="text-xs text-gray-500">{new Date(conv.updatedAt).toLocaleDateString('es-ES')}</div>
                  </button>
                  <button onClick={() => handleDeleteConversation(conv.id)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-400 mb-1">Mensajes: {usage.used} / {usage.limit}</div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden mb-3">
              <div className={`h-full transition-all ${usagePercentage >= 90 ? 'bg-blue-400' : 'bg-blue-600'}`} style={{ width: `${Math.min(usagePercentage, 100)}%` }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => router.push('/account')} className="flex-1 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded transition-colors">Cuenta</button>
              {session?.user?.isAdmin && <button onClick={() => router.push('/admin')} className="flex-1 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded transition-colors">Admin</button>}
            </div>
            <button onClick={async () => { await fetch('/api/auth/signout-custom', { method: 'POST' }); window.location.href = '/login' }} className="w-full px-3 py-1.5 mt-2 text-xs bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded transition-colors">Cerrar sesión</button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 hover:bg-gray-800 rounded transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            {currentConversationId && (isEditingTitle ? 
              <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} onBlur={handleRenameConversation} onKeyDown={(e) => e.key === 'Enter' && handleRenameConversation()} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-600" autoFocus /> : 
              <button onClick={() => { setIsEditingTitle(true); setEditedTitle(currentConversationTitle) }} className="text-sm hover:text-blue-400 transition-colors">{currentConversationTitle}</button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <>
                <input type="text" placeholder="Buscar..." value={messageSearchQuery} onChange={(e) => setMessageSearchQuery(e.target.value)} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-600 w-48" />
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/share/${currentConversationId}`); alert('Link copiado') }} className="p-2 hover:bg-gray-800 rounded transition-colors" title="Compartir">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
                <div className="relative">
                  <button onClick={() => setShowExportMenu(!showExportMenu)} className="p-2 hover:bg-gray-800 rounded transition-colors" title="Exportar">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                  {showExportMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl overflow-hidden z-10">
                      <button onClick={() => handleExportConversation('txt')} className="w-full px-4 py-2.5 hover:bg-gray-800 transition-colors text-left text-sm">Exportar como TXT</button>
                      <button onClick={() => handleExportConversation('md')} className="w-full px-4 py-2.5 hover:bg-gray-800 transition-colors text-left text-sm">Exportar como Markdown</button>
                      <button onClick={() => handleExportConversation('json')} className="w-full px-4 py-2.5 hover:bg-gray-800 transition-colors text-left text-sm">Exportar como JSON</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div 
          className={`flex-1 overflow-y-auto p-4 ${isDragging ? 'bg-blue-900/10 border-2 border-dashed border-blue-500' : ''}`}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <p className="text-lg font-medium text-blue-400">Suelta tus archivos aquí</p>
                <p className="text-sm text-gray-400 mt-1">Imágenes y documentos de texto</p>
              </div>
            </div>
          )}

          {!isDragging && filteredMessages.length === 0 && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <Image src="/logo-from-e.png" alt="Logo" width={56} height={56} className="mb-4 opacity-40" />
              <h2 className="text-xl font-medium mb-2">¿En qué puedo ayudarte?</h2>
            </div>
          )}

          {!isDragging && filteredMessages.length > 0 && (
            <div className="max-w-6xl mx-auto space-y-4">
              {filteredMessages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex-shrink-0 flex items-center justify-center text-xs font-medium">C</div>}
                  <div className="flex flex-col max-w-[85%]">
                    <div className={`rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1a1a1a] text-gray-100 border border-gray-800'}`}>
                      <div className="whitespace-pre-wrap break-words text-sm">{message.content}</div>
                    </div>
                    {message.role === 'assistant' && <button onClick={() => handleCopyMessage(message.content)} className="self-start mt-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">Copiar</button>}
                  </div>
                  {message.role === 'user' && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0 flex items-center justify-center text-xs font-medium">{session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 p-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
            {attachedFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachedFiles.map((file) => (
                  <div key={file.id} className="relative inline-block">
                    {file.type === 'image' ? (
                      <img src={file.data} alt={file.name} className="h-16 rounded border border-gray-700" />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded border border-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span className="text-sm">{file.name}</span>
                      </div>
                    )}
                    <button type="button" onClick={() => removeAttachedFile(file.id)} className="absolute -top-2 -right-2 bg-gray-700 hover:bg-gray-600 rounded-full p-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="relative">
                <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} className="p-2.5 hover:bg-gray-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
                {showAttachMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <button type="button" onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false) }} className="w-full px-4 py-2.5 hover:bg-gray-800 transition-colors text-left flex items-center gap-3 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span>Añadir archivos</span>
                    </button>
                  </div>
                )}
              </div>

              <input ref={fileInputRef} type="file" multiple accept="image/*,.txt,.md" onChange={(e) => handleFilesSelect(e.target.files)} className="hidden" />
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe un mensaje..." disabled={loading} className="flex-1 px-4 py-2.5 bg-[#1a1a1a] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 disabled:opacity-50" />
              {loading ? (
                <button type="button" onClick={handleStopGeneration} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">Detener</button>
              ) : (
                <button type="submit" disabled={!input.trim()} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Enviar</button>
              )}
            </div>
          </form>
        </div>
      </div>

      {showProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Crear proyecto</h3>
            <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Nombre del proyecto" className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 mb-4" autoFocus />
            <div className="flex gap-3">
              <button onClick={() => { setShowProjectModal(false); setNewProjectName('') }} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleCreateProject} disabled={!newProjectName.trim()} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
