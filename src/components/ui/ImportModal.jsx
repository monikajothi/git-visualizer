import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader, CheckCircle, AlertCircle, Sparkles, FileText } from 'lucide-react'
import { extractNotesFromPDF } from '../../services/claudeExtract'
import useAppStore from '../../store/useAppStore'
import { sections } from '../../data/sections'

const STAGES = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
}

export default function ImportModal({ sectionId, onClose }) {
  const [stage, setStage] = useState(STAGES.idle)
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const { setImportedContent } = useAppStore()
  const sec = sections.find(s => s.id === sectionId)

  const handleFile = useCallback((f) => {
    if (!f || f.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }
    setFile(f)
    setError('')
    setStage(STAGES.idle)
    setPreview(null)
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const handleExtract = async () => {
    if (!file) return
    setStage(STAGES.loading)
    setError('')
    setPreview(null)
    try {
      const result = await extractNotesFromPDF(
        file,
        sec?.label ?? sectionId,
        (msg) => setProgress(msg)
      )
      setPreview(result)
      setStage(STAGES.success)
    } catch (err) {
      setError(err.message ?? 'Extraction failed. Please try again.')
      setStage(STAGES.error)
    }
  }

  const handleSave = () => {
    if (!preview) return
    setImportedContent(sectionId, preview)
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple" />
            <span className="font-mono font-semibold text-sm text-txt">Import Notes with AI</span>
            <span className="font-mono text-xs text-muted">— {sec?.label}</span>
          </div>
          <button onClick={onClose} className="text-muted hover:text-txt transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragging
                ? 'border-purple bg-purple/10'
                : file
                ? 'border-green/50 bg-green/5'
                : 'border-border hover:border-purple/50 hover:bg-surface2'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText size={20} className="text-green" />
                <div className="text-left">
                  <div className="font-mono text-sm text-green font-semibold">{file.name}</div>
                  <div className="text-xs text-muted">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
            ) : (
              <>
                <Upload size={28} className="text-muted mx-auto mb-3" />
                <div className="font-mono text-sm text-txt mb-1">Drop your PDF notes here</div>
                <div className="text-xs text-muted">or click to browse — handwritten PDFs work great</div>
              </>
            )}
          </div>

          {/* How it works */}
          {!file && (
            <div className="bg-surface2 border border-border rounded-xl p-4">
              <div className="font-mono text-xs text-muted mb-3">// How it works</div>
              <div className="space-y-2">
                {[
                  { step: '1', label: 'Drop your PDF', desc: 'Any handwritten notes on this Git topic' },
                  { step: '2', label: 'Claude reads it', desc: 'Vision AI extracts commands, concepts, tips' },
                  { step: '3', label: 'Cards auto-populate', desc: 'Saved locally — persists across sessions' },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="font-mono text-xs text-purple shrink-0 w-4">{item.step}.</span>
                    <div>
                      <span className="font-mono text-xs text-txt">{item.label} </span>
                      <span className="text-xs text-muted">— {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {stage === STAGES.loading && (
            <div className="flex items-center gap-3 bg-purple/10 border border-purple/30 rounded-xl px-4 py-3">
              <Loader size={16} className="text-purple animate-spin shrink-0" />
              <span className="font-mono text-xs text-purple">{progress || 'Processing...'}</span>
            </div>
          )}

          {/* Error */}
          {stage === STAGES.error && (
            <div className="flex items-start gap-3 bg-red/10 border border-red/30 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-red shrink-0 mt-0.5" />
              <span className="text-xs text-red">{error}</span>
            </div>
          )}

          {/* Preview of extracted content */}
          {stage === STAGES.success && preview && (
            <div className="bg-green/5 border border-green/30 rounded-xl p-4 max-h-56 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} className="text-green" />
                <span className="font-mono text-xs text-green font-semibold">Extraction complete!</span>
              </div>
              <div className="text-xs text-muted mb-3 leading-relaxed">{preview.summary}</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: 'Concepts', count: preview.concepts?.length ?? 0, color: 'blue' },
                  { label: 'Commands', count: preview.commands?.length ?? 0, color: 'green' },
                  { label: 'Key Points', count: preview.keyPoints?.length ?? 0, color: 'purple' },
                ].map(stat => (
                  <div key={stat.label} className={`text-center bg-${stat.color}/10 border border-${stat.color}/30 rounded-lg py-2`}>
                    <div className={`font-mono text-lg font-bold text-${stat.color}`}>{stat.count}</div>
                    <div className="text-[10px] text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
              {preview.keyPoints?.slice(0, 3).map((pt, i) => (
                <div key={i} className="text-xs text-muted flex gap-2 mb-1">
                  <span className="text-green shrink-0">→</span>{pt}
                </div>
              ))}
              {(preview.keyPoints?.length ?? 0) > 3 && (
                <div className="text-[10px] text-muted mt-1">+{preview.keyPoints.length - 3} more...</div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-border text-muted font-mono text-xs hover:text-txt hover:border-border/80 transition-all"
            >
              Cancel
            </button>

            {stage !== STAGES.success ? (
              <button
                onClick={handleExtract}
                disabled={!file || stage === STAGES.loading}
                className="flex-1 py-2 rounded-lg bg-purple/20 border border-purple/40 text-purple font-mono text-xs font-semibold hover:bg-purple/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {stage === STAGES.loading
                  ? <><Loader size={12} className="animate-spin" /> Extracting...</>
                  : <><Sparkles size={12} /> Extract with Claude</>
                }
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex-1 py-2 rounded-lg bg-green/20 border border-green/40 text-green font-mono text-xs font-semibold hover:bg-green/30 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={12} /> Save to Section
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
