interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function exportAsText(messages: Message[], title: string) {
  let text = `${title}\n${'='.repeat(title.length)}\n\n`
  
  messages.forEach((msg) => {
    const author = msg.role === 'user' ? 'Usuario' : 'Claude'
    text += `${author}:\n${msg.content}\n\n---\n\n`
  })
  
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilename(title)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportAsMarkdown(messages: Message[], title: string) {
  let md = `# ${title}\n\n`
  
  messages.forEach((msg) => {
    const author = msg.role === 'user' ? '**Usuario**' : '**Claude**'
    md += `${author}:\n\n${msg.content}\n\n---\n\n`
  })
  
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilename(title)}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportAsJSON(messages: Message[], title: string) {
  const data = {
    title,
    exportedAt: new Date().toISOString(),
    messages,
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilename(title)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9áéíóúñü\s-]/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 50)
}
