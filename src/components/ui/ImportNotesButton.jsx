import { useState, useRef } from 'react'
import { Sparkles, CheckCircle, AlertCircle, RefreshCw, X, FolderOpen, Upload } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

// ─── Prompt ──────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert at reading handwritten student notes about Git version control.
Extract ALL content carefully — commands, explanations, flags, use cases, tips, examples.
Return ONLY valid JSON (no markdown fences, no preamble) with this exact structure:
{
  "title": "section title from notes",
  "summary": "one clear sentence summary",
  "concepts": [{ "term": "name", "definition": "clear explanation", "tag": "core|command|tip|flag" }],
  "commands": [{ "cmd": "git command", "desc": "what it does", "output": ["sample output line"], "flags": [{"flag":"--name","desc":"what it does"}] }],
  "keyPoints": ["important point from notes"],
  "useCases": ["when to use this"],
  "bestPractices": ["best practice tip"],
  "warnings": ["caution or warning"]
}`

// ─── API call via Vite proxy (avoids CORS) ───────────────────────────────────
async function callClaude(base64, onProgress) {
  onProgress('Sending to Claude AI...')

  // In dev:  POST /api/claude/v1/messages → proxied to api.anthropic.com/v1/messages
  // In prod: you'd need a real backend — for now this works perfectly in npm run dev
  const resp = await fetch('/api/claude/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 }
          },
          {
            type: 'text',
            text: 'Extract all Git notes from these handwritten pages. Return only the JSON structure.'
          }
        ]
      }]
    })
  })

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`
    try { const e = await resp.json(); msg = e?.error?.message || msg } catch {}
    throw new Error(msg)
  }

  onProgress('Processing extracted content...')
  const data = await resp.json()
  const raw = data.content?.map(b => b.text || '').join('') || ''
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

  if (!clean) throw new Error('Empty response from Claude')
  return JSON.parse(clean)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result.split(',')[1])
    r.onerror = () => rej(new Error('Failed to read file'))
    r.readAsDataURL(file)
  })
}

async function fetchPublicPdf(url, onProgress) {
  onProgress(`Fetching ${url.split('/').pop()}...`)
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Could not load PDF: ${url} (${resp.status}). Make sure the file exists in public/notes/`)
  const blob = await resp.blob()
  return fileToBase64(blob)
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ImportNotesButton({ sectionId, publicPdfPath, onImported }) {
  const [state, setState] = useState('idle')
  const [progress, setProgress] = useState('')
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const { saveExtractedContent, getExtractedContent, clearExtractedContent } = useAppStore()
  const hasData = !!getExtractedContent(sectionId)

  const runExtraction = async (base64getter) => {
    setState('loading')
    setError('')
    try {
      const base64 = await base64getter()
      const data = await callClaude(base64, setProgress)
      setPreview(data)
      setState('preview')
    } catch (e) {
      console.error('Extraction error:', e)
      setError(e.message)
      setState('error')
    }
  }

  const handlePublicPdf  = () => runExtraction(() => fetchPublicPdf(publicPdfPath, setProgress))
  const handleUpload     = (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file'); setState('error'); return
    }
    runExtraction(async () => { setProgress('Reading uploaded PDF...'); return fileToBase64(file) })
  }

  const confirm = () => {
    saveExtractedContent(sectionId, preview)
    setState('success')
    onImported?.(preview)
  }

  const reset = () => {
    clearExtractedContent(sectionId)
    setState('idle'); setPreview(null); setError(''); setProgress('')
  }

  // ── Already imported ────────────────────────────────────────────────────
  if (hasData && state === 'idle') return (
    <div className="flex items-center gap-3 p-4 bg-green/5 border border-green/30 rounded-xl">
      <CheckCircle size={16} className="text-green shrink-0" />
      <div className="flex-1">
        <div className="text-xs font-mono text-green font-semibold">Notes imported & active</div>
        <div className="text-xs text-muted mt-0.5">Section is populated from your extracted notes.</div>
      </div>
      <button onClick={reset} className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-txt border border-border rounded-lg px-3 py-1.5 transition-colors">
        <RefreshCw size={11} /> Re-import
      </button>
    </div>
  )

  // ── Success ─────────────────────────────────────────────────────────────
  if (state === 'success') return (
    <div className="flex items-center gap-3 p-4 bg-green/5 border border-green/30 rounded-xl">
      <CheckCircle size={16} className="text-green" />
      <div>
        <div className="text-xs font-mono text-green font-semibold">✓ Saved! Section is now populated.</div>
        <div className="text-xs text-muted mt-0.5">Scroll up to see your notes rendered as interactive cards.</div>
      </div>
    </div>
  )

  // ── Error ────────────────────────────────────────────────────────────────
  if (state === 'error') return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-4 bg-red/5 border border-red/30 rounded-xl">
        <AlertCircle size={16} className="text-red shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs font-mono text-red font-semibold">Extraction failed</div>
          <div className="text-xs text-muted mt-1 leading-relaxed">{error}</div>
        </div>
        <button onClick={() => setState('idle')} className="text-muted hover:text-txt transition-colors shrink-0">
          <X size={14} />
        </button>
      </div>
      {/* Debug tips */}
      <div className="bg-surface border border-border rounded-xl p-4 text-xs font-mono space-y-1.5">
        <div className="text-muted font-semibold mb-2">// Troubleshooting</div>
        <div className="text-muted flex gap-2"><span className="text-yellow">1.</span> Make sure you ran <code className="text-green">npm run dev</code> (not a static server)</div>
        <div className="text-muted flex gap-2"><span className="text-yellow">2.</span> Add your API key: create <code className="text-green">.env</code> file with <code className="text-green">VITE_ANTHROPIC_API_KEY=sk-ant-...</code></div>
        <div className="text-muted flex gap-2"><span className="text-yellow">3.</span> For public PDF: make sure file is at <code className="text-green">public/notes/{sectionId}.pdf</code></div>
        <div className="text-muted flex gap-2"><span className="text-yellow">4.</span> Check browser console (F12) for full error details</div>
      </div>
    </div>
  )

  // ── Loading ──────────────────────────────────────────────────────────────
  if (state === 'loading') return (
    <div className="p-5 bg-purple/5 border border-purple/30 rounded-xl space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-purple border-t-transparent rounded-full animate-spin shrink-0" />
        <div>
          <div className="text-xs font-mono text-purple font-semibold">Claude is reading your handwriting...</div>
          <div className="text-xs text-muted mt-0.5">{progress}</div>
        </div>
      </div>
      <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
        <div className="h-full bg-purple rounded-full animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  )

  // ── Preview ──────────────────────────────────────────────────────────────
  if (state === 'preview' && preview) return (
    <div className="border border-purple/40 bg-purple/5 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-purple/30 bg-purple/10">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple" />
          <span className="font-mono text-sm font-bold text-purple">Claude extracted your notes ✓</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setState('idle')}
            className="text-xs font-mono px-3 py-1.5 border border-border rounded-lg text-muted hover:text-txt transition-colors">
            Cancel
          </button>
          <button onClick={confirm}
            className="text-xs font-mono px-4 py-1.5 bg-purple text-white rounded-lg font-semibold hover:bg-purple/80 transition-colors">
            ✓ Save & populate section
          </button>
        </div>
      </div>
      <div className="p-5 space-y-4 max-h-72 overflow-y-auto">
        <div>
          <div className="font-mono text-xs text-muted mb-1">Title detected:</div>
          <div className="font-mono text-sm font-bold text-txt">{preview.title}</div>
          {preview.summary && <div className="text-xs text-muted mt-1 leading-relaxed">{preview.summary}</div>}
        </div>
        {preview.commands?.length > 0 && (
          <div>
            <div className="font-mono text-xs text-muted mb-2">Commands found ({preview.commands.length}):</div>
            <div className="space-y-1">
              {preview.commands.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center gap-3 text-xs bg-surface border border-border rounded-lg px-3 py-1.5">
                  <code className="font-mono text-green shrink-0">{c.cmd}</code>
                  <span className="text-muted truncate">{c.desc}</span>
                </div>
              ))}
              {preview.commands.length > 5 && <div className="text-xs text-muted pl-2">+ {preview.commands.length - 5} more...</div>}
            </div>
          </div>
        )}
        {preview.concepts?.length > 0 && (
          <div>
            <div className="font-mono text-xs text-muted mb-2">Concepts ({preview.concepts.length}):</div>
            <div className="flex flex-wrap gap-1.5">
              {preview.concepts.map((c, i) => (
                <span key={i} className="font-mono text-[10px] bg-surface border border-border rounded px-2 py-0.5 text-blue">{c.term}</span>
              ))}
            </div>
          </div>
        )}
        {preview.keyPoints?.length > 0 && (
          <div>
            <div className="font-mono text-xs text-muted mb-2">Key points ({preview.keyPoints.length}):</div>
            <ul className="space-y-1">
              {preview.keyPoints.slice(0, 4).map((p, i) => (
                <li key={i} className="text-xs text-muted flex gap-2"><span className="text-green shrink-0">→</span>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )

  // ── Idle — show options ──────────────────────────────────────────────────
  return (
    <>
      <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
        onChange={e => handleUpload(e.target.files?.[0])} />

      <div className="border border-dashed border-purple/40 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-purple" />
          <span className="font-mono text-sm font-semibold text-purple">Import your notes with AI</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Claude reads your handwritten PDF and populates this section automatically with commands, concepts, key points, and best practices.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {publicPdfPath && (
            <button onClick={handlePublicPdf}
              className="flex items-start gap-3 p-4 bg-surface border border-border rounded-xl hover:border-purple/40 hover:bg-purple/5 transition-all text-left group">
              <FolderOpen size={16} className="text-purple shrink-0 mt-0.5" />
              <div>
                <div className="font-mono text-xs font-semibold text-txt group-hover:text-purple transition-colors">Use PDF from notes folder</div>
                <div className="text-[10px] text-muted mt-1 font-mono">{publicPdfPath}</div>
              </div>
            </button>
          )}
          <button onClick={() => fileRef.current?.click()}
            className="flex items-start gap-3 p-4 bg-surface border border-border rounded-xl hover:border-blue/40 hover:bg-blue/5 transition-all text-left group">
            <Upload size={16} className="text-blue shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-xs font-semibold text-txt group-hover:text-blue transition-colors">Upload PDF from computer</div>
              <div className="text-[10px] text-muted mt-1">Pick any PDF file</div>
            </div>
          </button>
        </div>

        {/* API key reminder */}
        <div className="bg-surface2 border border-border rounded-lg p-3">
          <div className="font-mono text-[10px] text-muted space-y-1">
            <div className="text-yellow font-semibold mb-1">⚡ Required setup:</div>
            <div>1. Create <code className="text-green">.env</code> in project root</div>
            <div>2. Add: <code className="text-green">VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here</code></div>
            <div>3. Restart dev server: <code className="text-green">npm run dev</code></div>
          </div>
        </div>
      </div>
    </>
  )
}