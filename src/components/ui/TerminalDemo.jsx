import { useEffect, useState, useRef } from 'react'
import Terminal, { TypingLine } from './Terminal'

export default function TerminalDemo({ lines = [], className = '' }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const speedRef = useRef(38)

  useEffect(() => {
    if (!playing) return
    // playing handled by onDone advancing
  }, [playing])

  function handleDone() {
    if (!playing) return
    setTimeout(() => {
      if (index < lines.length - 1) setIndex(i => i + 1)
      else setPlaying(false)
    }, 300)
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={() => { setPlaying(p => !p) }}
          aria-pressed={playing}
          aria-label={playing ? 'Pause demo' : 'Play demo'}
          className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => { setIndex(i => Math.max(0, i - 1)) }}
          aria-label="Previous line"
          className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted"
        >Prev</button>
        <button
          onClick={() => { setIndex(i => Math.min(lines.length - 1, i + 1)); setPlaying(false) }}
          aria-label="Next line"
          className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted"
        >Next</button>
        <div className="text-xs text-muted ml-auto">Line {index + 1}/{lines.length}</div>
      </div>
      <div className={`bg-[#010409] border border-border rounded-lg p-4 font-mono text-sm ${className}`}>
        {lines.length === 0 ? (
          <span className="text-muted">$ <span className="cursor-blink" /></span>
        ) : (
          <div>
            {lines.map((l, i) => (
              <div key={i} style={{ display: i === index ? 'block' : 'none' }}>
                <TypingLine prompt="$" cmd={l.cmd} outputs={l.out ? [l.out] : (l.outputs || [])} speed={speedRef.current} onDone={handleDone} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
