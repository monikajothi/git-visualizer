import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import UndoDecisionTree from '../visualizers/UndoDecisionTree'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.undoing
function Card({ children, className='' }) { return <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>{children}</div> }
function H({ children }) { return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2> }

const resetModeColors = { 'Soft Reset':'green','Mixed Reset':'yellow','Hard Reset':'red' }

const VisualContent = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">↩️</span>
        <h1 className="font-mono font-bold text-2xl text-txt">Undoing Changes</h1>
        <Badge color="orange">Completed</Badge>
      </div>
      <p className="text-sm text-muted">checkout, restore, reset, revert, stash, clean — every way to undo things in Git.</p>
    </div>

    {/* Decision Tree — INTERACTIVE */}
    <div>
      <H>Interactive Decision Tree — What Do You Want to Undo?</H>
      <Card>
        <UndoDecisionTree />
      </Card>
    </div>

    {/* 3 areas */}
    <div>
      <H>The 3 Git Areas</H>
      <div className="flex items-center gap-3">
        {[
          { label:'Working Dir',   sub:'make changes',     color:'red' },
          { label:'Staging Area',  sub:'git add',          color:'yellow' },
          { label:'Repository',    sub:'git commit',       color:'green' },
        ].map((a,i)=>(
          <div key={i} className="flex items-center gap-3 flex-1">
            <div className={`flex-1 border border-${a.color}/30 bg-${a.color}/5 rounded-xl p-4 text-center`}>
              <div className={`font-mono text-sm font-bold text-${a.color}`}>{a.label}</div>
              <div className="text-[10px] text-muted mt-1 font-mono">{a.sub}</div>
            </div>
            {i<2 && <div className="text-muted text-xl shrink-0">→</div>}
          </div>
        ))}
      </div>
    </div>

    {/* Reset modes visual */}
    <div>
      <H>git reset — 3 Modes Compared</H>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {d.reset.modes.map((m,i)=>{
          const color = resetModeColors[m.name]
          return (
            <Card key={i} className={`border-${color}/30 bg-${color}/5`}>
              <code className={`font-mono text-xs text-${color} block mb-2`}>{['--soft','--mixed','--hard'][i]}</code>
              <div className="font-mono text-sm font-bold text-txt mb-2">{m.name.replace(' Reset','')}</div>
              <p className="text-xs text-muted leading-relaxed mb-3">{m.desc}</p>
              <code className={`font-mono text-[10px] text-${color} bg-black/20 rounded px-2 py-1 block`}>{m.cmd}</code>
              <div className="mt-3 space-y-1">
                {[['HEAD','✓','✓','✓'],['Index','✗','✓','✓'],['WorkDir','✗','✗','✓']].map(([area,...marks])=>(
                  <div key={area} className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-muted w-14">{area}</span>
                    <span className={marks[i]==='✓'?`text-${color}`:'text-muted/30'}>{marks[i]==='✓'?'modified':'unchanged'}</span>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </div>

    {/* Stash */}
    <div>
      <H>git stash — Temporary Save</H>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-xs text-muted mb-3 leading-relaxed">{d.stash.desc}</p>
          <div className="space-y-1.5">
            {d.stash.usages.slice(0,6).map((u,i)=>(
              <div key={i} className="flex items-start gap-3 text-xs bg-[#010409] border border-border rounded px-3 py-1.5">
                <code className="font-mono text-orange shrink-0 min-w-[180px]">{u.cmd}</code>
                <span className="text-muted">{u.desc}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="font-mono text-xs text-muted mb-3">How stash works:</div>
          <ol className="space-y-2">
            {d.stash.howItWorks.map((s,i)=>(
              <li key={i} className="flex items-start gap-2 text-xs text-muted">
                <span className="text-orange shrink-0">{i+1}.</span>{s}
              </li>
            ))}
          </ol>
          <div className="mt-4 border-t border-border pt-3">
            <div className="font-mono text-xs text-muted mb-2">Stash stack (LIFO):</div>
            {['stash@{0}: WIP on main','stash@{1}: feature wip','stash@{2}: hotfix start'].map((s,i)=>(
              <div key={i} className="font-mono text-xs text-orange/70 leading-6">{s}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>

    {/* git revert vs reset summary */}
    <div>
      <H>revert vs reset — Key Difference</H>
      <Card className="bg-[#010409]">
        <div className="grid grid-cols-2 gap-6 font-mono text-xs">
          <div>
            <div className="text-purple font-bold mb-2">git revert</div>
            <div className="text-muted space-y-1.5">
              <div className="flex gap-2"><span className="text-green">✓</span>Creates NEW commit</div>
              <div className="flex gap-2"><span className="text-green">✓</span>History preserved</div>
              <div className="flex gap-2"><span className="text-green">✓</span>Safe for shared branches</div>
              <div className="flex gap-2"><span className="text-green">✓</span>Transparent — others see the revert</div>
            </div>
          </div>
          <div>
            <div className="text-red font-bold mb-2">git reset</div>
            <div className="text-muted space-y-1.5">
              <div className="flex gap-2"><span className="text-yellow">⚠</span>Rewrites history</div>
              <div className="flex gap-2"><span className="text-yellow">⚠</span>Commits disappear</div>
              <div className="flex gap-2"><span className="text-red">✗</span>Dangerous on shared branches</div>
              <div className="flex gap-2"><span className="text-green">✓</span>Recovery via reflog (local)</div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    {/* git clean */}
    <div>
      <H>git clean — Remove Untracked Files</H>
      <Card>
        <p className="text-xs text-muted mb-3">{d.clean.desc}</p>
        <div className="space-y-2">
          {d.clean.options.map((o,i)=>(
            <div key={i} className="flex items-start gap-3 border-b border-border pb-2 last:border-0 text-xs">
              <code className="font-mono text-red shrink-0 min-w-[140px]">{o.flag}</code>
              <span className="text-muted">{o.desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
)

export default function UndoingSection() {
  return (
    <SectionWrapper id="undoing" tabs={[
      { id:'visual',    label:'Visual Guide',   icon:'🎯', content:<VisualContent /> },
      { id:'interview', label:'Interview Prep', icon:'🧠', content:<InterviewPanel questions={interviewQA.undoing} quickFacts={quickFacts.undoing} /> },
    ]} />
  )
}
