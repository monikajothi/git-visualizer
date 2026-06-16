import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import CommandExplorer from '../ui/CommandExplorer'
import StagingFlow from '../visualizers/StagingFlow'
import InterviewPanel from '../ui/InterviewPanel'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.basics
function Card({ children, className='' }) { return <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>{children}</div> }
function H({ children }) { return <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">// {children}</h2> }

const coreCommands = [
  { cmd:'git init',         desc:'Initialize a new Git repo. Creates .git folder with all tracking metadata.',
    output:['Initialized empty Git repository in ./.git/'],
    flags:[{ flag:'--bare', desc:'Create repo without working dir (for servers)' }] },
  { cmd:'git status',       desc:'Show what is staged, unstaged, and untracked. Your most used command.',
    output:['On branch main','Changes to be committed:','  new file: index.html','Changes not staged:','  modified: style.css','Untracked files:','  app.js'],
    flags:[{ flag:'-s', desc:'Short format — compact summary' },{ flag:'-b', desc:'Show branch info' }] },
  { cmd:'git add .',        desc:'Stage ALL changes. Git creates blob objects and updates the index.',
    output:[''],
    flags:[{ flag:'-p', desc:'Interactive patch mode — stage hunks selectively' },{ flag:'-u', desc:'Stage only tracked files (no new files)' }] },
  { cmd:'git commit -m""',  desc:'Record staged changes as a new commit. Creates commit object with tree + metadata.',
    output:['[main 4a2f1c3] feat: add login','2 files changed, 48 insertions(+)'],
    flags:[{ flag:'--amend', desc:'Modify the last commit (before push)' },{ flag:'--no-edit', desc:'Amend without changing message' },{ flag:'--dry-run', desc:'Preview what would be committed' }] },
  { cmd:'git log --oneline',desc:'Condensed commit history — hash + message only.',
    output:['4a2f1c3 feat: add login','e8b3d22 fix: resolve conflict','1c09a44 init: project setup'],
    flags:[{ flag:'--graph', desc:'ASCII branch graph' },{ flag:'--all', desc:'Show all branches' },{ flag:'-n 5', desc:'Last 5 commits only' }] },
  { cmd:'git diff',         desc:'Show line-by-line differences between working dir and staging area.',
    output:['diff --git a/app.js b/app.js','--- a/app.js','+++ b/app.js','@@ -1,3 +1,4 @@','-const x = 1;','+const x = 42;'],
    flags:[{ flag:'--cached', desc:'Diff staging vs last commit' },{ flag:'--stat', desc:'Summary only — files changed' },{ flag:'--word-diff', desc:'Word-level diff' }] },
]

const VisualContent = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">⚡</span>
        <h1 className="font-mono font-bold text-2xl text-txt">Git Basics</h1>
        <Badge color="blue">Completed</Badge>
      </div>
      <p className="text-sm text-muted">Core operations — init, add, commit, status, log, diff. The commands you use every single day.</p>
    </div>

    {/* Animated Staging Flow */}
    <div>
      <H>Staging Flow — Watch Files Move</H>
      <Card className="p-6">
        <StagingFlow />
      </Card>
    </div>

    {/* Interactive Command Explorer */}
    <div>
      <H>Core Commands — Click to Explore</H>
      <CommandExplorer commands={coreCommands} />
    </div>

    {/* Staging area deep dive */}
    <div>
      <H>Staging Area Internals</H>
      <Card>
        <p className="text-sm text-muted mb-4 leading-relaxed">{d.stagingArea.explanation}</p>
        <div className="space-y-2">
          {d.stagingArea.howItWorks.map((s,i)=>(
            <div key={i} className="flex items-start gap-3 text-xs p-2.5 bg-surface2 rounded-lg">
              <span className="font-mono text-green shrink-0 w-4">{i+1}.</span>
              <span className="text-muted">{s}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* .gitignore */}
    <div>
      <H>.gitignore</H>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-xs text-muted mb-3 leading-relaxed">{d.gitignore.purpose}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {d.gitignore.commonPatterns.map((p,i)=>(
              <code key={i} className="font-mono text-xs bg-[#010409] border border-border rounded px-2 py-1 text-green">{p}</code>
            ))}
          </div>
          <div className="space-y-1">
            {d.gitignore.bestPractice.map((b,i)=>(
              <div key={i} className="text-xs text-muted flex gap-2"><span className="text-green">→</span>{b}</div>
            ))}
          </div>
        </Card>
        <Card className="bg-[#010409]">
          <div className="font-mono text-xs text-muted mb-2"># .gitignore</div>
          {['# Dependencies','node_modules/','','# Build output','dist/','build/','','# Env files','.env','.env.local','','# Logs','*.log','','# OS files','.DS_Store','Thumbs.db'].map((line,i)=>(
            <div key={i} className={`font-mono text-xs leading-6 ${line.startsWith('#')?'text-muted/50':line===''?'h-2':'text-green'}`}>{line}</div>
          ))}
        </Card>
      </div>
    </div>

    {/* Commit flags */}
    <div>
      <H>Commit Flags & Options</H>
      <div className="space-y-2">
        {d.commitDetails.flags.map((f,i)=>(
          <div key={i} className="flex items-start gap-3 bg-surface2 border border-border rounded-lg px-4 py-3">
            <code className="font-mono text-xs text-purple shrink-0 min-w-[100px]">{f.flag}</code>
            <span className="text-xs text-muted">{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function BasicsSection() {
  return (
    <SectionWrapper id="basics" tabs={[
      { id:'visual',    label:'Visual Guide',   icon:'🎯', content:<VisualContent /> },
      { id:'interview', label:'Interview Prep', icon:'🧠', content:<InterviewPanel questions={interviewQA.basics} quickFacts={quickFacts.basics} /> },
    ]} />
  )
}
