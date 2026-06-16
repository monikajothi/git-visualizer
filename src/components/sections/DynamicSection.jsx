import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import { Sparkles } from 'lucide-react'

// Renders AI-extracted notes content dynamically
export default function DynamicSection({ data, sectionMeta }) {
  const color = sectionMeta?.color || 'purple'

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-purple/5 border border-purple/30 rounded-xl">
        <Sparkles size={16} className="text-purple shrink-0" />
        <div>
          <div className="font-mono text-xs font-bold text-purple">{data.title}</div>
          <div className="text-xs text-muted mt-0.5 leading-relaxed">{data.summary}</div>
        </div>
        <Badge color="purple" className="ml-auto shrink-0">AI extracted</Badge>
      </div>

      {/* Commands */}
      {data.commands?.length > 0 && (
        <div>
          <SectionTitle>Commands</SectionTitle>
          <div className="space-y-2">
            {data.commands.map((cmd, i) => (
              <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="flex items-start gap-4 px-4 py-3 border-b border-border/50">
                  <code className={`font-mono text-sm font-bold text-${color} shrink-0`}>{cmd.cmd}</code>
                  <span className="text-xs text-muted leading-relaxed">{cmd.desc}</span>
                </div>
                {(cmd.flags?.length > 0 || cmd.output?.length > 0) && (
                  <div className="grid grid-cols-2 gap-0 divide-x divide-border">
                    {cmd.flags?.length > 0 && (
                      <div className="p-3 space-y-1.5">
                        <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">Flags</div>
                        {cmd.flags.map((f, j) => (
                          <div key={j} className="flex items-start gap-2 text-xs">
                            <code className="font-mono text-cyan shrink-0">{f.flag}</code>
                            <span className="text-muted">{f.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {cmd.output?.length > 0 && (
                      <div className="p-3 bg-[#010409]">
                        <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">Output</div>
                        {cmd.output.map((o, j) => (
                          <div key={j} className={`font-mono text-xs leading-5 ${o.startsWith('+') ? 'text-green' : o.startsWith('-') ? 'text-red' : 'text-muted'}`}>{o}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concepts */}
      {data.concepts?.length > 0 && (
        <div>
          <SectionTitle>Concepts</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {data.concepts.map((c, i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-4 hover:border-blue/30 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-sm font-bold text-blue">{c.term}</span>
                  {c.tag && <Badge color="muted">{c.tag}</Badge>}
                </div>
                <p className="text-xs text-muted leading-relaxed">{c.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Points */}
      {data.keyPoints?.length > 0 && (
        <div>
          <SectionTitle>Key Points</SectionTitle>
          <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
            {data.keyPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <span className={`text-${color} shrink-0 mt-0.5 font-mono`}>{String(i+1).padStart(2,'0')}.</span>
                <span className="text-muted leading-relaxed">{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Use Cases + Best Practices side by side */}
      {(data.useCases?.length > 0 || data.bestPractices?.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {data.useCases?.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-4">
              <SectionTitle>Use Cases</SectionTitle>
              <ul className="space-y-1.5">
                {data.useCases.map((u, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted">
                    <span className="text-cyan shrink-0 mt-0.5">→</span>{u}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.bestPractices?.length > 0 && (
            <div className="bg-surface border border-green/20 rounded-xl p-4">
              <SectionTitle>Best Practices</SectionTitle>
              <ul className="space-y-1.5">
                {data.bestPractices.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted">
                    <span className="text-green shrink-0 mt-0.5">✓</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Warnings */}
      {data.warnings?.length > 0 && (
        <div className="bg-yellow/5 border border-yellow/30 rounded-xl p-4">
          <SectionTitle>⚠ Warnings & Cautions</SectionTitle>
          <ul className="space-y-1.5">
            {data.warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-yellow">
                <span className="shrink-0 mt-0.5">!</span>{w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

function SectionTitle({ children }) {
  return <h3 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-3">// {children}</h3>
}
