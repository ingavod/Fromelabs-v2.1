'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  theme: 'dark' | 'light'
}

const C = {
  surface2: '#1a1a1a',
  border:   '#2a2a2a',
  text:     '#e2e8f0',
  textMuted:'#64748b',
  blue:     '#3b82f6',
  userBg:   '#1e3a5f',
  userBord: '#1d4ed8',
}

export default function MessageBubble({ role, content, theme }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = role === 'user'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback para navegadores sin clipboard API
      const el = document.createElement('textarea')
      el.value = content
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '16px', gap: '10px' }}>

      {/* Avatar asistente */}
      {!isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#fff', flexShrink: 0, marginTop: '2px' }}>
          AI
        </div>
      )}

      <div style={{ maxWidth: '78%', position: 'relative' }}>
        {/* Burbuja */}
        <div style={{
          borderRadius: '12px',
          padding: isUser ? '10px 14px' : '12px 16px 12px 14px',
          background: isUser ? C.userBg : C.surface2,
          border: `1px solid ${isUser ? C.userBord : C.border}`,
          color: C.text,
          fontSize: '0.9rem',
          lineHeight: '1.6',
        }}>
          {/* Botón copiar — solo en mensajes del asistente */}
          {!isUser && (
            <button onClick={handleCopy}
              style={{ position: 'absolute', top: '8px', right: '8px', background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : C.border}`, borderRadius: '6px', padding: '3px 9px', cursor: 'pointer', fontSize: '0.72rem', color: copied ? '#86efac' : C.textMuted, transition: 'all 0.15s' }}
              onMouseOver={e => { if (!copied) (e.currentTarget.style.color = '#f1f5f9') }}
              onMouseOut={e => { if (!copied) (e.currentTarget.style.color = C.textMuted) }}>
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          )}

          <div style={{ paddingTop: isUser ? '0' : '20px' }}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div"
                      customStyle={{ margin: '8px 0', borderRadius: '8px', fontSize: '0.85rem' }} {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code style={{ background: 'rgba(0,0,0,0.35)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85em', fontFamily: 'monospace' }} {...props}>
                      {children}
                    </code>
                  )
                },
                p:          ({ children }) => <p style={{ margin: '0.4em 0', lineHeight: '1.65' }}>{children}</p>,
                ul:         ({ children }) => <ul style={{ margin: '0.4em 0', paddingLeft: '1.4em' }}>{children}</ul>,
                ol:         ({ children }) => <ol style={{ margin: '0.4em 0', paddingLeft: '1.4em' }}>{children}</ol>,
                li:         ({ children }) => <li style={{ margin: '0.25em 0' }}>{children}</li>,
                h1:         ({ children }) => <h1 style={{ fontSize: '1.4em', fontWeight: '700', margin: '0.5em 0' }}>{children}</h1>,
                h2:         ({ children }) => <h2 style={{ fontSize: '1.2em', fontWeight: '700', margin: '0.5em 0' }}>{children}</h2>,
                h3:         ({ children }) => <h3 style={{ fontSize: '1.05em', fontWeight: '700', margin: '0.5em 0' }}>{children}</h3>,
                blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #1d4ed8', paddingLeft: '1em', margin: '0.5em 0', opacity: 0.85, fontStyle: 'italic' }}>{children}</blockquote>,
                a:          ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: C.blue, textDecoration: 'underline' }}>{children}</a>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Avatar usuario */}
      {isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', flexShrink: 0, marginTop: '2px' }}>
          TU
        </div>
      )}
    </div>
  )
}
