import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import GitObjectModel from '../visualizers/GitObjectModel'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.intro

function Card({ children, className = '' }) {
  return <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>{children}</div>
}
function H({ children }) {
  return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2>
}

const VisualContent = () => (
  <div className="space-y-8">
    <div className="flex items-start gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🌱</span>
          <h1 className="font-mono font-bold text-2xl text-txt">Git Intro & Version Control</h1>
          <Badge color="green">Completed</Badge>
        </div>
        <p className="text-sm text-muted leading-relaxed max-w-2xl">
          Git is a <span className="text-green font-semibold">distributed version control system</span> — powerful & versatile.
          Every developer holds a complete copy of the entire repo history on their local machine.
        </p>
      </div>
    </div>

    {/* Key Features */}
    <div>
      <H>Key Features</H>
      <div className="grid grid-cols-2 gap-3">
        {d.keyFeatures.map((f, i) => (
          <Card key={i} className="flex items-start gap-3 hover:border-green/30 transition-colors">
            <span className="text-2xl">{f.icon}</span>
            <div>
              <div className="font-mono text-sm font-bold text-txt mb-1">{f.title}</div>
              <div className="text-xs text-muted leading-relaxed">{f.desc}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>

    {/* Object Model — INTERACTIVE */}
    <div>
      <H>Git Object Model — Click to Explore</H>
      <GitObjectModel />
    </div>

    {/* DVCS vs CVCS */}
    <div>
      <H>Distributed vs Centralised VCS</H>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'DVCS (Git)', color: 'green', items: d.dvcsVsCvcs.dvcs, icon: '✓' },
          { label: 'CVCS (SVN)', color: 'red',   items: d.dvcsVsCvcs.cvcs, icon: '✗' },
        ].map((col, i) => (
          <Card key={i}>
            <Badge color={col.color} className="mb-3">{col.label}</Badge>
            <ul className="space-y-2">
              {col.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-muted">
                  <span className={`text-${col.color} mt-0.5 shrink-0`}>{col.icon}</span>{item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>

    {/* Workflows */}
    <div>
      <H>Common Workflows</H>
      <div className="space-y-3">
        {d.workflows.map((w, i) => (
          <Card key={i} className="hover:border-blue/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Badge color={['blue','purple','green'][i]}>{i+1}</Badge>
              <span className="font-mono font-semibold text-sm text-txt">{w.name}</span>
              {w.note && <span className="text-xs text-yellow ml-auto italic">{w.note}</span>}
            </div>
            <ol className="space-y-1">
              {w.steps.map((s, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-muted">
                  <span className="font-mono text-muted/50 shrink-0">{j+1}.</span>{s}
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    </div>

    {/* Config */}
    <div>
      <H>Git Configuration</H>
      <div className="bg-[#010409] border border-border rounded-xl overflow-hidden">
        {d.config.map((c, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-2.5 border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors">
            <code className="font-mono text-xs text-green flex-1">{c.cmd}</code>
            <span className="text-xs text-muted shrink-0 text-right max-w-[200px]">{c.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function IntroSection() {
  return (
    <SectionWrapper id="intro" tabs={[
      { id: 'visual',    label: 'Visual Guide', icon: '🎯', content: <VisualContent /> },
      { id: 'interview', label: 'Interview Prep', icon: '🧠', content: <InterviewPanel questions={interviewQA.intro} quickFacts={quickFacts.intro} /> },
    ]} />
  )
}
