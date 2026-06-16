import { useState } from 'react'
import { FileText, ZoomIn, ZoomOut, Download } from 'lucide-react'

export default function PdfViewer({ src, title }) {
  const [zoom, setZoom] = useState(100)

  if (!src) return (
    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-border rounded-xl text-center p-8">
      <FileText size={40} className="text-muted mb-3" />
      <p className="text-muted text-sm">Notes PDF not attached yet.</p>
      <p className="text-muted/60 text-xs mt-1">Complete the topic and upload your PDF.</p>
    </div>
  )

  return (
    <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-surface">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface2 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText size={13} className="text-muted" />
          <span className="text-xs font-mono text-muted truncate max-w-xs">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(60, z-20))} className="p-1 text-muted hover:text-txt transition-colors"><ZoomOut size={13} /></button>
          <span className="text-xs font-mono text-muted w-10 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z+20))} className="p-1 text-muted hover:text-txt transition-colors"><ZoomIn size={13} /></button>
          <a href={src} download className="p-1 text-muted hover:text-txt transition-colors" title="Download"><Download size={13} /></a>
        </div>
      </div>
      <div className="overflow-auto bg-[#1a1a1a]" style={{ maxHeight:'80vh' }}>
        <div style={{ transform:`scale(${zoom/100})`, transformOrigin:'top center', transition:'transform 0.2s' }}>
          <iframe src={src} title={title} className="w-full border-none" style={{ height:'90vh', minHeight:'600px' }} />
        </div>
      </div>
    </div>
  )
}
