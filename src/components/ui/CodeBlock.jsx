import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CodeBlock({ code, lang='bash', className='' }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),1800) }
  return (
    <div className={`bg-[#010409] border border-border rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-xs font-mono text-muted">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-muted hover:text-txt transition-colors">
          {copied ? <Check size={11} className="text-green" /> : <Copy size={11} />}
          <span>{copied?'Copied!':'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed"><code className="text-green">{code}</code></pre>
    </div>
  )
}
