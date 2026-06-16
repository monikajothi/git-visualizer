import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import CommandExplorer from '../ui/CommandExplorer'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.merge
function Card({ children, className='' }) { return <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>{children}</div> }
function H({ children }) { return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2> }

const VisualContent = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🔀</span>
        <h1 className="font-mono font-bold text-2xl text-txt">Merge & Rebase</h1>
        <Badge color="purple">Done</Badge>
      </div>
      <p className="text-sm text-muted">Merge strategies, rebasing, and conflict resolution with interactive tips.</p>
    </div>

    <div>
      <H>Merge Strategies</H>
      <Card>
        <div className="space-y-3">
          {d.mergeStrategies.map((m,i)=>(
            <div key={i} className="p-3 bg-surface2 border border-border rounded-lg">
              <div className="font-mono text-xs text-muted">{m.name}</div>
              <div className="text-sm text-txt mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div>
      <H>Common Merge Commands</H>
      <CommandExplorer commands={d.commands.map(c=>({ cmd: c.cmd, desc: c.desc, output: c.output || [], flags: c.flags || [] }))} />
    </div>

    <div>
      <H>Conflict Resolution</H>
      <Card>
        <div className="text-xs text-muted leading-relaxed">{d.conflictResolution.markers.join(' • ')}</div>
        <div className="mt-3 space-y-2">
          {d.conflictResolution.strategies.map((s,i)=> (
            <div key={i} className="text-xs text-muted flex gap-2"><span className="text-yellow">→</span>{s}</div>
          ))}
        </div>
      </Card>
    </div>
  </div>
)

export default function MergeSection() {
  return (
    <SectionWrapper id="merge" tabs={[
      { id:'visual', label:'Visual Guide', icon:'🔀', content:<VisualContent /> },
      { id:'interview', label:'Interview Prep', icon:'🧠', content:<InterviewPanel questions={interviewQA.merge} quickFacts={quickFacts.merge} /> },
    ]} />
  )
}
