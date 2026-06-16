import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Terminal } from 'lucide-react'

export default function CommandExplorer({ commands = [] }) {
  const [active, setActive] = useState(null)
  const [typed, setTyped] = useState('')
  const [showOut, setShowOut] = useState(false)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  const cmd = commands.find(c => c.cmd === active)

  useEffect(() => {
    if (!cmd) return
    setTyped(''); setShowOut(false)
    let i = 0
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTyped(cmd.cmd.slice(0, ++i))
      if (i >= cmd.cmd.length) { clearInterval(timerRef.current); setTimeout(() => setShowOut(true), 300) }
    }, 38)
    return () => clearInterval(timerRef.current)
  }, [active])

  const copy = () => {
    if (cmd) { navigator.clipboard.writeText(cmd.cmd); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  }

  return (
    <div className="space-y-4">
      {/* Command grid */}
      <div className="grid grid-cols-2 gap-2">
        {commands.map((c, i) => (
          <motion.button key={i}
            onClick={() => setActive(c.cmd)}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -1 }}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              active === c.cmd
                ? 'border-green/40 bg-green/5'
                : 'border-border bg-surface hover:border-green/20 hover:bg-surface2'
            }`}>
            <code className={`font-mono text-xs font-semibold block mb-1 ${active === c.cmd ? 'text-green' : 'text-txt'}`}>
              {c.cmd}
            </code>
            <span className="text-[11px] text-muted leading-snug line-clamp-2">{c.desc}</span>
          </motion.button>
        ))}
      </div>

      {/* Terminal panel */}
      <AnimatePresence mode="wait">
        {cmd && (
          <motion.div key={active}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-surface2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red/60" />
                <div className="w-3 h-3 rounded-full bg-yellow/60" />
                <div className="w-3 h-3 rounded-full bg-green/60" />
              </div>
              <Terminal size={11} className="text-muted" />
              <span className="font-mono text-xs text-muted flex-1">bash</span>
              <button onClick={copy} className="flex items-center gap-1 text-xs font-mono text-muted hover:text-txt transition-colors">
                {copied ? <Check size={11} className="text-green" /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Terminal body */}
            <div className="bg-[#010409] p-4 min-h-[80px]">
              <div className="flex items-center gap-2 font-mono text-sm mb-2">
                <span className="text-green select-none">$</span>
                <span className="text-txt">{typed}</span>
                {typed.length < cmd.cmd.length && <span className="cursor-blink" />}
              </div>
              <AnimatePresence>
                {showOut && cmd.output && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="pl-3 border-l-2 border-border mt-2">
                    {cmd.output.map((line, i) => (
                      <div key={i} className={`font-mono text-xs leading-relaxed ${
                        line.startsWith('+') ? 'text-green' :
                        line.startsWith('-') ? 'text-red' :
                        line.startsWith('[') ? 'text-green' :
                        line.startsWith('hint') || line.startsWith('On branch') ? 'text-blue' :
                        line.startsWith('fatal') || line.startsWith('error') ? 'text-red' :
                        'text-muted'
                      }`}>{line}</div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Description + flags */}
            <div className="p-4 border-t border-border bg-surface">
              <p className="text-sm text-muted leading-relaxed mb-3">{cmd.desc}</p>
              {cmd.flags?.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">Common flags</div>
                  {cmd.flags.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <code className="font-mono text-cyan shrink-0 min-w-[160px]">{f.flag}</code>
                      <span className="text-muted">{f.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
