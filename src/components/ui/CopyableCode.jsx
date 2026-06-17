import { useState } from 'react'

export default function CopyableCode({ code = '', language = '', prefix = '' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prefix + code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      const ta = document.createElement('textarea')
      ta.value = prefix + code
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch (err) {}
      document.body.removeChild(ta)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
        aria-pressed={copied}
        className="absolute right-2 top-2 text-[11px] px-2 py-1 rounded-md bg-surface border border-border text-muted"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="text-[11px] font-mono bg-black/40 text-green-400 p-4 rounded-xl overflow-x-auto leading-relaxed" aria-live="polite">
        {code}
      </pre>
    </div>
  )
}
