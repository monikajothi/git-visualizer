import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Brain, Star } from 'lucide-react'
import Badge from '../ui/Badge'

export default function InterviewPanel({ questions = [], quickFacts = [] }) {
  const [open, setOpen] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? questions : questions.filter(q => q.level === filter)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-purple" />
          <span className="font-mono text-sm font-semibold text-txt">Interview Questions</span>
          <Badge color="purple">{questions.length} questions</Badge>
        </div>
        <div className="flex gap-1.5">
          {['all','basic','intermediate','advanced'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                filter === f ? 'bg-purple/10 border-purple/40 text-purple' : 'bg-surface border-border text-muted hover:text-txt'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {filtered.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="border border-border rounded-xl overflow-hidden bg-surface">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-surface2 transition-colors">
              <Badge color={item.level}>{item.level}</Badge>
              <span className="text-sm text-txt flex-1 leading-snug">{item.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-muted shrink-0" />
              </motion.div>
            </button>

            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden">
                  <div className="px-5 pb-4 border-t border-border/50">
                    <div className="pt-3 text-sm text-muted leading-relaxed font-mono bg-[#010409] rounded-lg p-4 mt-2 border border-border whitespace-pre-wrap">
                      {item.a}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Quick Facts */}
      {quickFacts.length > 0 && (
        <div className="border border-yellow/30 bg-yellow/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star size={13} className="text-yellow" />
            <span className="font-mono text-xs font-semibold text-yellow">Quick Facts to Remember</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickFacts.map((fact, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted">
                <span className="text-yellow mt-0.5 shrink-0">⚡</span>{fact}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
