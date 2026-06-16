import { useState } from 'react'
import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.history
function Card({ children, className='' }) { return <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>{children}</div> }
function H({ children }) { return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2> }
const cmdColors = { 'git show':'blue','git log':'green','git diff':'cyan','git blame':'yellow','git grep':'purple','git bisect':'orange','git shortlog':'red' }

const VisualContent = () => {
  const [open, setOpen] = useState('git show')
  const cmd = d.commands.find(c=>c.cmd===open)
  const color = cmdColors[open]||'muted'

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔍</span>
          <h1 className="font-mono font-bold text-2xl text-txt">Viewing & Searching History</h1>
          <Badge color="cyan">Completed</Badge>
        </div>
        <p className="text-sm text-muted">git show, log, diff, blame, grep, bisect — exploring what happened.</p>
      </div>

      {/* Diff visualizer */}
      <div>
        <H>Understanding git diff Output</H>
        <Card className="bg-[#010409]">
          <div className="font-mono text-xs leading-6 space-y-0.5">
            {[
              ['text-muted','diff --git a/app.js b/app.js'],
              ['text-muted','index 3f4a12..9cd321 100644'],
              ['text-muted','--- a/app.js'],
              ['text-muted','+++ b/app.js'],
              ['text-cyan','@@ -1,5 +1,6 @@ function login() {   ← hunk header'],
              ['text-muted','   const user = getUser()'],
              ['text-red','-  const pass = "secret"    ← removed line'],
              ['text-green','+  const pass = hashPassword()  ← added line'],
              ['text-green','+  validateToken(user)          ← new line'],
              ['text-muted','   return authenticate(user, pass)'],
            ].map(([cls,line],i)=>(
              <div key={i} className={cls}>{line}</div>
            ))}
          </div>
        </Card>
      </div>

      {/* Command tabs */}
      <div>
        <H>Commands — Click to Explore</H>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {d.commands.map(c=>{
            const col = cmdColors[c.cmd]||'muted'
            return (
              <button key={c.cmd} onClick={()=>setOpen(c.cmd)}
                className={`font-mono text-xs px-3 py-2 rounded-lg border transition-all ${open===c.cmd?`bg-${col}/10 border-${col}/40 text-${col}`:'bg-surface border-border text-muted hover:text-txt'}`}>
                {c.cmd}
              </button>
            )
          })}
        </div>

        {cmd && (
          <div className="space-y-3">
            <Card className={`border-${color}/30 bg-${color}/5`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-mono font-bold text-base text-${color}`}>{cmd.cmd}</span>
                <Badge color={color}>command</Badge>
              </div>
              <p className="text-sm text-muted leading-relaxed">{cmd.desc}</p>
            </Card>

            {cmd.flags && (
              <Card>
                <H>Options & Flags</H>
                <div className="space-y-2">
                  {cmd.flags.map((f,i)=>(
                    <div key={i} className="flex items-start gap-3 border-b border-border pb-2 last:border-0 text-xs">
                      <code className={`font-mono text-${color} shrink-0 min-w-[200px]`}>{f.flag}</code>
                      <span className="text-muted">{f.desc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {cmd.variants && (
              <Card>
                <H>Variants</H>
                {cmd.variants.map((v,i)=>(
                  <div key={i} className="flex items-start gap-3 text-xs bg-surface2 rounded-lg px-3 py-2 mb-2">
                    <code className={`font-mono text-${color} shrink-0 min-w-[240px]`}>{v.syntax}</code>
                    <span className="text-muted">{v.desc}</span>
                  </div>
                ))}
              </Card>
            )}

            {cmd.steps && (
              <Card>
                <H>git bisect — Step by Step</H>
                <ol className="space-y-3">
                  {cmd.steps.map((s,i)=>(
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-mono text-xs text-orange border border-orange/30 bg-orange/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{s.step}</span>
                      <div>
                        <div className="text-xs text-txt">{s.desc}</div>
                        {s.cmd && <code className="font-mono text-xs text-green mt-1 block">{s.cmd}</code>}
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 p-3 bg-orange/5 border border-orange/30 rounded-lg">
                  <div className="text-xs text-orange font-mono font-semibold mb-1">Binary Search Efficiency</div>
                  <div className="text-xs text-muted">1000 commits → only ~10 checks needed. O(log n) vs O(n).</div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Log graph visual */}
      <div>
        <H>git log --graph --oneline --decorate</H>
        <Card className="bg-[#010409]">
          <div className="font-mono text-xs leading-7 space-y-0">
            {[
              ['text-purple','* 4a2f1c3 (HEAD -> main, tag: v1.0.0) feat: final release'],
              ['text-muted','|\\'],
              ['text-blue','| * 9f3a1b2 (feature/auth) feat: add OAuth'],
              ['text-blue','| * 7e2c4d5 feat: login page'],
              ['text-muted','|/'],
              ['text-green','* 3b1d6e8 fix: resolve conflict'],
              ['text-green','* 1a2b3c4 (origin/main) init: project setup'],
            ].map(([cls,line],i)=>(
              <div key={i} className={cls}>{line}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function HistorySection() {
  return (
    <SectionWrapper id="history" tabs={[
      { id:'visual',    label:'Visual Guide',   icon:'🎯', content:<VisualContent /> },
      { id:'interview', label:'Interview Prep', icon:'🧠', content:<InterviewPanel questions={interviewQA.history} quickFacts={quickFacts.history} /> },
    ]} />
  )
}
