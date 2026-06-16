import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.files
function Card({ children, className='' }) { return <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>{children}</div> }
function H({ children }) { return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2> }

const VisualContent = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">📁</span>
        <h1 className="font-mono font-bold text-2xl text-txt">Remove, Rename & Permissions</h1>
        <Badge color="yellow">Completed</Badge>
      </div>
      <p className="text-sm text-muted">git rm, mv, chmod, .gitattributes — managing files and permissions in git.</p>
    </div>

    {/* git rm */}
    <div>
      <H>git rm — Removing Files</H>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-xs text-muted mb-4 leading-relaxed">{d.rm.desc}</p>
          <div className="space-y-2">
            {d.rm.options.map((o,i)=>(
              <div key={i} className="border-l-2 border-red/40 pl-3 py-1">
                <code className="font-mono text-xs text-red">{o.flag}</code>
                <p className="text-xs text-muted mt-0.5">{o.desc}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <H>Recovery Methods</H>
          {d.rm.recovery.map((r,i)=>(
            <div key={i} className="bg-surface2 border border-border rounded-lg p-3 mb-2">
              <div className="text-xs text-yellow mb-1.5 font-medium">{r.case}</div>
              <code className="font-mono text-xs text-green block">{r.cmd}</code>
            </div>
          ))}
        </Card>
      </div>
    </div>

    {/* git mv */}
    <div>
      <H>git mv — Move & Rename</H>
      <Card className="mb-3">
        <p className="text-xs text-muted mb-3 leading-relaxed">{d.mv.desc}</p>
        <div className="grid grid-cols-2 gap-3">
          {d.mv.examples.map((e,i)=>(
            <div key={i} className="bg-[#010409] border border-border rounded-lg p-3">
              <Badge color="yellow" className="mb-2">{e.desc}</Badge>
              <code className="font-mono text-xs text-green block">{e.cmd}</code>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border space-y-1.5">
          <div className="text-xs text-muted"><span className="text-green">Why use git mv? </span>{d.mv.why}</div>
          <div className="text-xs text-muted"><span className="text-cyan">Track history: </span>{d.mv.checking}</div>
        </div>
      </Card>
    </div>

    {/* Permissions visual */}
    <div>
      <H>File Permissions (Unix)</H>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="font-mono text-sm text-muted mb-4 bg-[#010409] rounded-lg p-3">
            <span className="text-green">-</span>
            <span className="text-yellow">rwx</span>
            <span className="text-blue">r-x</span>
            <span className="text-purple">r--</span>
            <span className="text-muted ml-3 text-xs">myscript.sh</span>
          </div>
          <div className="space-y-2 text-xs">
            {[['text-green','-','regular file'],['text-yellow','rwx','owner: read+write+execute'],['text-blue','r-x','group: read+execute'],['text-purple','r--','others: read only']].map(([cls,sym,label],i)=>(
              <div key={i} className="flex items-center gap-3">
                <code className={`font-mono w-8 text-center ${cls}`}>{sym}</code>
                <span className="text-muted">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <div className="font-mono text-xs text-muted mb-2">Octal values:</div>
            {[['r','4'],['w','2'],['x','1'],['rwx (7)','= 4+2+1'],['r-x (5)','= 4+0+1']].map(([k,v],i)=>(
              <div key={i} className="flex gap-3 text-xs font-mono">
                <span className="text-green w-12">{k}</span>
                <span className="text-muted">{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <H>chmod Examples</H>
          <div className="space-y-2">
            {d.permissions.chmod.map((c,i)=>(
              <div key={i} className="bg-[#010409] border border-border rounded-lg px-3 py-2">
                <code className="font-mono text-xs text-green">{c.example}</code>
                <div className="text-xs text-muted mt-1">{c.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {d.permissions.platforms.map((p,i)=>(
          <Card key={i}>
            <Badge color={['green','blue','purple'][i]} className="mb-2">{p.name}</Badge>
            <p className="text-xs text-muted leading-relaxed">{p.desc}</p>
          </Card>
        ))}
      </div>
    </div>

    {/* .gitattributes */}
    <div>
      <H>.gitattributes</H>
      <Card>
        <p className="text-xs text-muted mb-3">{d.gitattributes.desc}</p>
        <div className="bg-[#010409] border border-border rounded-lg p-3 mb-3">
          {d.gitattributes.examples.map((e,i)=>(
            <code key={i} className="font-mono text-xs text-green block leading-6">{e}</code>
          ))}
        </div>
        <H>Common Issues</H>
        {d.gitattributes.commonIssues.map((issue,i)=>(
          <div key={i} className="flex items-start gap-2 text-xs text-muted mb-1.5">
            <span className="text-red shrink-0 mt-0.5">!</span>{issue}
          </div>
        ))}
      </Card>
    </div>
  </div>
)

export default function FilesSection() {
  return (
    <SectionWrapper id="files" tabs={[
      { id:'visual',    label:'Visual Guide',   icon:'🎯', content:<VisualContent /> },
      { id:'interview', label:'Interview Prep', icon:'🧠', content:<InterviewPanel questions={interviewQA.files} quickFacts={quickFacts.files} /> },
    ]} />
  )
}
