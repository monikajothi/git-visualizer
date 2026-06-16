import { useState, useRef } from 'react'
import { Sparkles, CheckCircle, AlertCircle, RefreshCw, X, FolderOpen, Upload } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

// ─── Claude API extraction ────────────────────────────────────────────────────
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

async function callClaudeWithBase64(base64, onProgress) {
  onProgress('Sending to Claude AI...')
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
          { type: 'text', text: 'Extract all Git notes from these handwritten pages. Return only the JSON.' }
        ]
      }]
    })
  })
  if (!resp.ok) {
    const e = await resp.json()
    throw new Error(e?.error?.message || `API error ${resp.status}`)
  }
  onProgress('Processing extracted content...')
  const data = await resp.json()
  const raw = data.content?.map(b => b.text || '').join('')
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
  return JSON.parse(clean)
}

// Convert file → base64
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result.split(',')[1])
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

// Fetch PDF from public/notes/ and convert to base64
async function publicPdfToBase64(url, onProgress) {
  onProgress('Fetching PDF from notes folder...')
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Could not load ${url}`)
  const blob = await resp.blob()
  return fileToBase64(blob)
}
// ─────────────────────────────────────────────────────────────────────────────

export default function ImportNotesButton({ sectionId, publicPdfPath, onImported }) {
  const [state, setState] = useState('idle')   // idle | loading | preview | success | error
  const [progress, setProgress] = useState('')
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const { saveExtractedContent, getExtractedContent, clearExtractedContent } = useAppStore()
  const hasData = !!getExtractedContent(sectionId)

  // ── Core extract flow ──────────────────────────────────────────────────────
  const runExtraction = async (base64) => {
    try {
      const data = await callClaudeWithBase64(base64, setProgress)
      setPreview(data)
      setState('preview')
    } catch (e) {
      setError(e.message)
      setState('error')
    }
  }

  // Option A — use PDF already in public/notes/
  const handlePublicPdf = async () => {
    if (!publicPdfPath) return
    setState('loading')
    try {
      const base64 = await publicPdfToBase64(publicPdfPath, setProgress)
      await runExtraction(base64)
    } catch (e) {
      setError(e.message)
      setState('error')
    }
  }

  // Option B — upload PDF from computer
  const handleUploadedFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.')
      setState('error')
      return
    }
    setState('loading')
    try {
      setProgress('Reading uploaded PDF...')
      const base64 = await fileToBase64(file)
      await runExtraction(base64)
    } catch (e) {
      setError(e.message)
      setState('error')
    }
  }

  const confirm = () => {
    saveExtractedContent(sectionId, preview)
    setState('success')
    onImported?.(preview)
  }

  const reset = () => {
    clearExtractedContent(sectionId)
    setState('idle')
    setPreview(null)
    setError('')
    setProgress('')
  }
  // ──────────────────────────────────────────────────────────────────────────

  // Already has extracted data
  if (hasData && state === 'idle') return (
    <div className="flex items-center gap-3 p-4 bg-green/5 border border-green/30 rounded-xl">
      <CheckCircle size={16} className="text-green shrink-0" />
      <div className="flex-1">
        <div className="text-xs font-mono text-green font-semibold">Notes imported & active</div>
        <div className="text-xs text-muted mt-0.5">This section is populated from your extracted notes.</div>
      </div>
      <button onClick={reset} className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-txt border border-border rounded-lg px-3 py-1.5 transition-colors">
        <RefreshCw size={11} /> Re-import
      </button>
    </div>
  )

  if (state === 'success') return (
    <div className="flex items-center gap-3 p-4 bg-green/5 border border-green/30 rounded-xl">
      <CheckCircle size={16} className="text-green" />
      <div>
        <div className="text-xs font-mono text-green font-semibold">✓ Saved! Section is now populated.</div>
        <div className="text-xs text-muted mt-0.5">Scroll up to see your extracted notes rendered.</div>
      </div>
    </div>
  )

  if (state === 'error') return (
    <div className="flex items-center gap-3 p-4 bg-red/5 border border-red/30 rounded-xl">
      <AlertCircle size={16} className="text-red shrink-0" />
      <div className="flex-1">
        <div className="text-xs font-mono text-red font-semibold">Extraction failed</div>
        <div className="text-xs text-muted mt-0.5">{error}</div>
      </div>
      <button onClick={() => setState('idle')} className="text-muted hover:text-txt transition-colors"><X size={14} /></button>
    </div>
  )

  if (state === 'loading') return (
    <div className="flex items-center gap-3 p-4 bg-purple/5 border border-purple/30 rounded-xl">
      <div className="w-4 h-4 border-2 border-purple border-t-transparent rounded-full animate-spin shrink-0" />
      <div>
        <div className="text-xs font-mono text-purple font-semibold">Claude is reading your handwriting...</div>
        <div className="text-xs text-muted mt-0.5">{progress}</div>
      </div>
    </div>
  )

  // Preview — show extracted content, ask to confirm
  if (state === 'preview' && preview) return (
    <div className="border border-purple/40 bg-purple/5 rounded-xl overflow-hidden">
      {/* Header */}
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

      {/* Preview content */}
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
              {preview.commands.length > 5 && <div className="text-xs text-muted pl-2">+ {preview.commands.length - 5} more commands...</div>}
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

  // IDLE — show import options
  return (
    <>
      <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
        onChange={e => handleUploadedFile(e.target.files?.[0])} />

      <div className="border border-dashed border-purple/40 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-purple" />
          <span className="font-mono text-sm font-semibold text-purple">Import your notes with AI</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Claude will read your handwritten PDF and automatically populate this section with commands, concepts, key points, and interview questions.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Option A — from public/notes */}
          {publicPdfPath && (
            <button onClick={handlePublicPdf}
              className="flex items-center gap-2.5 p-3.5 bg-surface border border-border rounded-xl hover:border-purple/40 hover:bg-purple/5 transition-all text-left group">
              <FolderOpen size={16} className="text-purple shrink-0" />
              <div>
                <div className="font-mono text-xs font-semibold text-txt group-hover:text-purple transition-colors">Use PDF from notes folder</div>
                <div className="text-[10px] text-muted mt-0.5 font-mono truncate">{publicPdfPath.split('/').pop()}</div>
              </div>
            </button>
          )}

          {/* Option B — upload from computer */}
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2.5 p-3.5 bg-surface border border-border rounded-xl hover:border-blue/40 hover:bg-blue/5 transition-all text-left group">
            <Upload size={16} className="text-blue shrink-0" />
            <div>
              <div className="font-mono text-xs font-semibold text-txt group-hover:text-blue transition-colors">Upload new PDF</div>
              <div className="text-[10px] text-muted mt-0.5">Pick file from your computer</div>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
