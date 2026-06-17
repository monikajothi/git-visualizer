import { useState } from 'react'
import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.advanced
function Card({ children, className='' }) { return <div className={`bg-surface border border-border rounded-xl p-5 transition-all duration-300 ${className}`}>{children}</div> }
function H({ children }) { return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2> }

const topics = [
  { key:'collaboration',       label:'Collaboration',  icon:'🤝', color:'blue'   },
  { key:'tagging',             label:'Tagging',         icon:'🏷️', color:'green'  },
  { key:'cherryPicking',       label:'Cherry-Pick',     icon:'🍒', color:'red'    },
  { key:'packfiles',           label:'Packfiles',       icon:'📦', color:'orange' },
  { key:'hooks',                label:'Hooks',           icon:'🪝', color:'purple' },
  { key:'worktree',            label:'Worktree',        icon:'🌳', color:'cyan'   },
  { key:'subtreeSubmodules',   label:'Submodules',      icon:'🧩', color:'yellow' },
  { key:'filterBranch',        label:'Filter-Branch',   icon:'🧹', color:'pink'   },
]

const VisualContent = () => {
  const [open, setOpen] = useState('collaboration')
  const topic = topics.find(t=>t.key===open)
  const color = topic.color
  const data = d[open]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⚙️</span>
          <h1 className="font-mono font-bold text-2xl text-txt">Advanced Git</h1>
          <Badge color="purple">done</Badge>
        </div>
        <p className="text-sm text-muted">Collaboration workflows, tagging, cherry-picking, packfiles, hooks, worktrees, submodules & history rewriting.</p>
      </div>

      {/* Always-on visual: loose objects vs packfile */}
      <div>
        <H>Loose Objects vs Packfile</H>
        <Card className="bg-[#010409]">
          <div className="grid grid-cols-2 gap-6 font-mono text-xs">
            <div>
              <div className="text-red mb-2">Without pack — 50000 lines</div>
              <div className="flex flex-wrap gap-0.5">
                {Array.from({length:50}).map((_,i)=>(
                  <div key={i} className="w-2 h-6 bg-red/40 rounded-sm animate-pulse" style={{animationDelay:`${i*20}ms`}} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-green mb-2">With pack — 1098 lines</div>
              <div className="flex flex-wrap gap-0.5">
                <div className="w-2 h-6 bg-green/70 rounded-sm" title="base" />
                {Array.from({length:6}).map((_,i)=>(
                  <div key={i} className="w-2 h-6 bg-green/30 rounded-sm" title="deltas" />
                ))}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-muted mt-3">1000-line file × 50 commits × 2 changed lines/commit → base + diffs only</div>
        </Card>
      </div>

      {/* Topic tabs */}
      <div>
        <H>Topics — Click to Explore</H>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {topics.map(t=>(
            <button key={t.key} onClick={()=>setOpen(t.key)}
              className={`font-mono text-xs px-3 py-2 rounded-lg border transition-all duration-200 ${open===t.key?`bg-${t.color}/10 border-${t.color}/40 text-${t.color} scale-105`:'bg-surface border-border text-muted hover:text-txt hover:scale-105'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div key={open} className="space-y-3 transition-opacity duration-300">

          {open==='collaboration' && (
            <Card className={`border-${color}/30 bg-${color}/5`}>
              <H>Workflows</H>
              <div className="space-y-3">
                {data.workflows.map((w,i)=>(
                  <div key={i} className="flex items-start gap-3 border-b border-border pb-2 last:border-0">
                    <span className={`font-mono text-xs text-${color} shrink-0 min-w-[180px] font-semibold`}>{w.name}</span>
                    <span className="text-xs text-muted">{w.desc}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {open==='tagging' && (
            <>
              <Card className={`border-${color}/30 bg-${color}/5`}>
                <div className="text-xs text-muted mb-2">{data.desc}</div>
                <code className="font-mono text-xs text-green block">{data.flowSample}</code>
              </Card>
              <Card>
                <H>Viewing Tags</H>
                {data.viewing.map((v,i)=>(
                  <div key={i} className="flex items-start gap-3 text-xs bg-surface2 rounded-lg px-3 py-2 mb-2">
                    <code className={`font-mono text-${color} shrink-0 min-w-[200px]`}>{v.cmd}</code>
                    <span className="text-muted">{v.desc}</span>
                  </div>
                ))}
              </Card>
              <Card>
                <H>Create / Delete / Checkout / Push</H>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-3">
                    <code className="font-mono text-green shrink-0 min-w-[260px]">{data.tagOldCommit.cmd}</code>
                    <span className="text-muted">Tag an old commit</span>
                  </div>
                  {data.delete.map((v,i)=>(
                    <div key={i} className="flex items-start gap-3">
                      <code className="font-mono text-red shrink-0 min-w-[260px]">{v.cmd}</code>
                      <span className="text-muted">{v.desc}</span>
                    </div>
                  ))}
                  {data.checkout.map((v,i)=>(
                    <div key={i} className="flex items-start gap-3">
                      <code className="font-mono text-cyan shrink-0 min-w-[260px]">{v.cmd}</code>
                      <span className="text-muted">{v.desc}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <code className="font-mono text-yellow shrink-0 min-w-[260px]">{data.push.cmd}</code>
                    <span className="text-muted">{data.push.desc}</span>
                  </div>
                </div>
              </Card>
            </>
          )}

          {open==='cherryPicking' && (
            <>
              <Card className={`border-${color}/30 bg-${color}/5`}>
                <div className="text-xs text-muted">{data.desc}</div>
              </Card>
              <Card>
                <H>Usage</H>
                {data.usages.map((u,i)=>(
                  <div key={i} className="flex items-start gap-3 text-xs bg-surface2 rounded-lg px-3 py-2 mb-2">
                    <code className={`font-mono text-${color} shrink-0 min-w-[260px]`}>{u.cmd}</code>
                    <span className="text-muted">{u.label ? `[${u.label}] ` : ''}{u.desc}</span>
                  </div>
                ))}
              </Card>
              <Card className="bg-orange/5 border-orange/30">
                <div className="text-xs text-orange font-mono font-semibold mb-1">⚠️ Conflicts</div>
                <div className="text-xs text-muted">{data.conflicts.resolve}</div>
                <div className="text-xs text-muted mt-1">{data.conflicts.note}</div>
              </Card>
            </>
          )}

          {open==='packfiles' && (
            <>
              <Card className={`border-${color}/30 bg-${color}/5`}>
                <div className="text-xs text-muted mb-1"><b className="text-red">Problem:</b> {data.problem}</div>
                <div className="text-xs text-muted"><b className="text-green">Solution:</b> {data.solution}</div>
              </Card>
              <Card>
                <H>Delta Trick Example</H>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-red/10 rounded-lg p-3 text-red">{data.deltaTrick.example.without}</div>
                  <div className="bg-green/10 rounded-lg p-3 text-green">{data.deltaTrick.example.with}</div>
                </div>
              </Card>
              <Card>
                <H>When Clone Is Slow</H>
                {data.whenCloneSlow.cmds.map((c,i)=>(
                  <div key={i} className="flex items-start gap-3 text-xs mb-2">
                    <code className="font-mono text-cyan shrink-0 min-w-[260px]">{c.cmd}</code>
                    <span className="text-muted">{c.desc||''}</span>
                  </div>
                ))}
              </Card>
            </>
          )}

          {open==='hooks' && (
            <>
              <Card className={`border-${color}/30 bg-${color}/5`}>
                <div className="text-xs text-muted">{data.desc}</div>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <H>Client-Side</H>
                  <div className="text-[10px] text-muted mb-2">{data.clientSide.desc}</div>
                  {data.clientSide.hooks.map((h,i)=>(
                    <div key={i} className="text-xs mb-1"><code className="text-blue">{h.name}</code> — <span className="text-muted">{h.desc}</span></div>
                  ))}
                </Card>
                <Card>
                  <H>Server-Side</H>
                  <div className="text-[10px] text-muted mb-2">{data.serverSide.desc}</div>
                  {data.serverSide.hooks.map((h,i)=>(
                    <div key={i} className="text-xs mb-1"><code className="text-purple">{h.name}</code> — <span className="text-muted">{h.desc}</span></div>
                  ))}
                  <div className="text-xs text-muted mt-2">Webhooks: {data.serverSide.webhooks}</div>
                </Card>
              </div>
              <Card>
                <H>Tooling</H>
                <div className="text-xs text-muted"><code className="text-green">{data.tooling.tool}</code> — {data.tooling.desc}. {data.tooling.note}.</div>
              </Card>
            </>
          )}

          {open==='worktree' && (
            <>
              <Card className={`border-${color}/30 bg-${color}/5`}>
                <div className="text-xs text-muted">{data.desc}</div>
              </Card>
              <Card>
                {data.usages.map((u,i)=>(
                  <div key={i} className="flex items-start gap-3 text-xs bg-surface2 rounded-lg px-3 py-2 mb-2">
                    <code className={`font-mono text-${color} shrink-0 min-w-[200px]`}>{u.cmd}</code>
                    <span className="text-muted">[{u.label}]</span>
                  </div>
                ))}
              </Card>
            </>
          )}

          {open==='subtreeSubmodules' && (
            <Card className={`border-${color}/30 bg-${color}/5`}>
              <div className="text-xs text-muted mb-2">{data.desc}</div>
              <div className="text-xs text-muted">{data.submodules.desc}</div>
              <code className="font-mono text-xs text-green block mt-2">{data.submodules.cmd}</code>
              <div className="text-xs text-muted mt-2">Ops: {data.submodules.ops.join(', ')}</div>
            </Card>
          )}

          {open==='filterBranch' && (
            <>
              <Card className="bg-red/5 border-red/30">
                <div className="text-xs text-red font-mono font-semibold">git filter-branch</div>
                <div className="text-xs text-muted mt-1">{data.gitFilterBranch.desc} ({data.gitFilterBranch.note})</div>
              </Card>
              <Card className={`border-${color}/30 bg-${color}/5`}>
                <div className="text-xs text-green font-mono font-semibold">git filter-repo</div>
                <div className="text-xs text-muted mt-1">{data.gitFilterRepo.desc}</div>
                <code className="font-mono text-xs text-cyan block mt-2">{data.gitFilterRepo.install}</code>
                <ul className="text-xs text-muted mt-2 list-disc list-inside">
                  {data.gitFilterRepo.examples.map((e,i)=><li key={i}>{e}</li>)}
                </ul>
              </Card>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default function AdvancedSection() {
  return (
    <SectionWrapper id="advanced" tabs={[
      { id:'visual',    label:'Visual Guide',   icon:'🎯', content:<VisualContent /> },
      { id:'interview', label:'Interview Prep', icon:'🧠', content:<InterviewPanel questions={interviewQA.advanced} quickFacts={quickFacts.advanced} /> },
    ]} />
  )
}