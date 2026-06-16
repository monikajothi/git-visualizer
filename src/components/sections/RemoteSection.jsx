import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import CommandExplorer from '../ui/CommandExplorer'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.remote
function Card({ children, className='' }) { return <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>{children}</div> }
function H({ children }) { return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2> }

const VisualContent = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">☁️</span>
        <h1 className="font-mono font-bold text-2xl text-txt">Remote & Collaboration</h1>
        <Badge color="blue">Done</Badge>
      </div>
      <p className="text-sm text-muted">Push, pull, fetch, and remote workflows for collaborating with teammates.</p>
    </div>

    <div>
      <H>Remote Commands</H>
      <CommandExplorer commands={d.commands.map(c=>({ cmd: c.cmd, desc: c.desc, output: c.output || [], flags: c.flags || [] }))} />
    </div>

    <div>
      <H>Pull Strategies</H>
      <Card>
        <div className="space-y-2">
          {d.pullStrategies.map((p,i)=> (
            <div key={i} className="text-xs text-muted flex gap-2"><span className="text-green">→</span>{p.name}: {p.desc}</div>
          ))}
        </div>
      </Card>
    </div>
  </div>
)

export default function RemoteSection() {
  return (
    <SectionWrapper id="remote" tabs={[
      { id:'visual', label:'Visual Guide', icon:'☁️', content:<VisualContent /> },
      { id:'interview', label:'Interview Prep', icon:'🧠', content:<InterviewPanel questions={interviewQA.remote} quickFacts={quickFacts.remote} /> },
    ]} />
  )
}
