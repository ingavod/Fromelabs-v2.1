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

export async function exportAsPDF(messages: Message[], title: string) {
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - (margin * 2)
  let yPosition = margin

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(title, margin, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Exportado: ${new Date().toLocaleString('es-ES')}`, margin, yPosition)
  yPosition += 10

  doc.setDrawColor(200, 200, 200)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 10

  doc.setTextColor(0, 0, 0)
  
  messages.forEach((message, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = margin
    }

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    
    if (message.role === 'user') {
      doc.setTextColor(37, 99, 235)
      doc.text('Usuario:', margin, yPosition)
    } else {
      doc.setTextColor(59, 130, 246)
      doc.text('Claude:', margin, yPosition)
    }
    
    yPosition += 7

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    
    const lines = doc.splitTextToSize(message.content, maxWidth)
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = margin
      }
      
      doc.text(line, margin, yPosition)
      yPosition += 5
    })

    yPosition += 5

    if (index < messages.length - 1) {
      doc.setDrawColor(230, 230, 230)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5
    }
  })

  const totalPages = (doc as any).internal.pages.length - 1
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.text(
      `Página ${i} de ${totalPages} - From E Labs`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  doc.save(`${sanitizeFilename(title)}.pdf`)
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9áéíóúñü\s-]/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 50)
}