import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import CommandExplorer from '../ui/CommandExplorer'
import BranchGraph from '../visualizers/BranchGraph'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.branches
function Card({ children, className='' }) { return <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>{children}</div> }
function H({ children }) { return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2> }

const VisualContent = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🌿</span>
        <h1 className="font-mono font-bold text-2xl text-txt">Branching</h1>
        <Badge color="green">Done</Badge>
      </div>
      <p className="text-sm text-muted">Creating, switching, and managing branches. Visualize branching and merges interactively.</p>
    </div>

    <div>
      <H>Interactive Branch Graph</H>
      <Card className="p-6">
        <BranchGraph />
      </Card>
    </div>

    <div>
      <H>Common Branching Commands</H>
      <CommandExplorer commands={d.commands.map(c=>({ cmd: c.cmd, desc: c.desc, output: c.output || [], flags: c.flags || [] }))} />
    </div>

    <div>
      <H>Best Practices</H>
      <Card>
        <div className="space-y-2">
          {d.bestPractices.map((p,i)=> (
            <div key={i} className="text-xs text-muted flex gap-2"><span className="text-green">→</span>{p}</div>
          ))}
        </div>
      </Card>
    </div>
  </div>
)

export default function BranchesSection() {
  return (
    <SectionWrapper id="branches" tabs={[
      { id:'visual', label:'Visual Guide', icon:'🌿', content:<VisualContent /> },
      { id:'interview', label:'Interview Prep', icon:'🧠', content:<InterviewPanel questions={interviewQA.branches} quickFacts={quickFacts.branches} /> },
    ]} />
  )
}
