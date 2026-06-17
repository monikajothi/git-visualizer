import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import BranchGraph from '../visualizers/BranchGraph'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { sections } from '../../data/sections'
import useAppStore from '../../store/useAppStore'

function Card({ children, className='' }) {
  return <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>{children}</div>
}
function H({ children }) {
  return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2>
}

// ── Branch section has a real built-in visualizer ────────────────────────────
const BranchBuiltIn = () => (
  <div className="space-y-5">
    <H>Interactive Branch Graph — Animated</H>
    <Card><BranchGraph /></Card>
    <H>Key Commands Preview</H>
    <div className="grid grid-cols-2 gap-2">
      {[
        { cmd:'git branch <name>',     desc:'Create new branch at current commit' },
        { cmd:'git checkout -b <name>',desc:'Create + switch in one step' },
        { cmd:'git switch <name>',     desc:'Switch branches (modern, Git 2.23+)' },
        { cmd:'git branch -d <name>',  desc:'Delete a merged branch safely' },
        { cmd:'git merge <branch>',    desc:'Merge into current branch' },
        { cmd:'git branch -v',         desc:'List branches with last commit info' },
      ].map((c,i) => (
        <div key={i} className="flex items-start gap-3 bg-surface2 border border-border rounded-lg px-4 py-2.5">
          <code className="font-mono text-xs text-green shrink-0 min-w-[180px]">{c.cmd}</code>
          <span className="text-xs text-muted">{c.desc}</span>
        </div>
      ))}
    </div>
  </div>
)

// ── Generic placeholder for remote, merge, advanced ─────────────────────────
const GenericBuiltIn = ({ id }) => {
  const data = content[id]
  const sec  = sections.find(s => s.id === id)
  const color = sec?.color || 'muted'
  return (
    <div className="space-y-5">
      <div className={`border border-dashed border-${color}/30 bg-${color}/5 rounded-xl p-8 text-center`}>
        <div className="text-4xl mb-3">{sec?.icon}</div>
        <div className={`font-mono text-sm font-semibold text-${color} mb-2`}>
          Visualizer unlocks after your notes are imported
        </div>
        <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
          Import your PDF below → Claude reads it → this section fills with your content + interactive visuals.
        </p>
      </div>
      {data?.commands?.length > 0 && (
        <>
          <H>Key Commands Preview</H>
          <div className="space-y-2">
            {data.commands.map((c,i) => (
              <div key={i} className="flex items-start gap-4 bg-surface2 border border-border rounded-lg px-4 py-2.5">
                <code className={`font-mono text-xs text-${color} shrink-0 min-w-[200px]`}>{c.cmd}</code>
                <span className="text-xs text-muted">{c.desc}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ComingSoonSection({ id }) {
  const sec = sections.find(s => s.id === id)
  const { getExtractedContent } = useAppStore()
  const [refreshKey, setRefreshKey] = useState(0)
  const extracted = getExtractedContent(id)

  // Which public PDF to use (if you dropped it in notes folder already)
  // Convention: /notes/branches.pdf, /notes/remote.pdf etc.
  const publicPdfPath = `/notes/${id}.pdf`

  const handleImported = () => {
    // Force re-render so extracted content shows immediately
    setRefreshKey(k => k + 1)
  }

  // ── Visual tab ─────────────────────────────────────────────────────────────
  const VisualContent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{sec?.icon}</span>
          <h1 className="font-mono font-bold text-2xl text-txt">{sec?.label}</h1>
          <Badge color={extracted ? sec?.color || 'green' : 'muted'}>
            {extracted ? 'Notes imported ✓' : 'Import notes below'}
          </Badge>
        </div>
        <p className="text-sm text-muted">{sec?.description}</p>
      </div>

      {/* If notes imported → show dynamic extracted content */}
      <AnimatePresence mode="wait">
        {extracted ? (
          <motion.div key={`extracted-${refreshKey}`}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
            <DynamicSection data={extracted} sectionMeta={sec} />
          </motion.div>
        ) : (
          <motion.div key="builtin"
            initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {id === 'branches'
              ? <BranchBuiltIn />
              : <GenericBuiltIn id={id} />}
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  )

  return (
    <SectionWrapper id={id} tabs={[
      { id:'visual', label:'Visual Guide', icon:'🎯', content:<VisualContent /> },
    ]} />
  )
}
