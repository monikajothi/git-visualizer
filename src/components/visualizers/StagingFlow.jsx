import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, SkipForward } from 'lucide-react'

const FILES = [
  { name: 'index.html', icon: '📄', color: '#58a6ff' },
  { name: 'style.css',  icon: '🎨', color: '#bc8cff' },
  { name: 'app.js',    icon: '⚡', color: '#e3b341' },
]

const STEPS = [
  { cmd: 'echo "edit files"',             desc: 'You modify files in your working directory', phase: 'edit' },
  { cmd: 'git add index.html style.css',  desc: 'Stage specific files — takes a snapshot of file content', phase: 'add', files: [0, 1] },
  { cmd: 'git add app.js',               desc: 'Stage remaining file', phase: 'add', files: [2] },
  { cmd: 'git status',                    desc: 'See what is staged vs unstaged', phase: 'status' },
  { cmd: 'git commit -m "initial commit"',desc: 'Create commit — moves staged files to repo history', phase: 'commit' },
  { cmd: 'git log --oneline',             desc: 'View the new commit in history', phase: 'log' },
]

export default function StagingFlow() {
  const [step, setStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const [staged, setStaged] = useState([])
  const [committed, setCommitted] = useState([])
  const [typedCmd, setTypedCmd] = useState('')
  const [commits, setCommits] = useState([])
  const timerRef = useRef(null)

  const reset = () => {
    setStep(-1); setStaged([]); setCommitted([])
    setTypedCmd(''); setCommits([]); setRunning(false)
    clearTimeout(timerRef.current)
  }

  const typeCmd = (cmd, cb) => {
    setTypedCmd('')
    let i = 0
    const t = setInterval(() => {
      setTypedCmd(cmd.slice(0, ++i))
      if (i >= cmd.length) { clearInterval(t); setTimeout(cb, 400) }
    }, 40)
  }

  const runStep = (s) => {
    if (s >= STEPS.length) { setRunning(false); return }
    const cur = STEPS[s]
    setStep(s)
    typeCmd(cur.cmd, () => {
      if (cur.phase === 'add') setStaged(prev => [...prev, ...cur.files])
      if (cur.phase === 'commit') { setCommitted([0,1,2]); setStaged([]); setCommits(c => [...c, { hash: '4a2f1c3', msg: 'initial commit' }]) }
      timerRef.current = setTimeout(() => runStep(s + 1), 1600)
    })
  }

  const play = () => { setRunning(true); runStep(0) }
  const skipStep = () => { if (step < STEPS.length - 1) runStep(step + 1) }

  const curStep = STEPS[step] ?? null

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={play} disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-green/10 border border-green/40 text-green rounded-lg text-xs font-mono hover:bg-green/20 disabled:opacity-40 transition-all">
          <Play size={12} /> Animate
        </button>
        <button onClick={skipStep} disabled={!running || step >= STEPS.length - 1}
          className="flex items-center gap-2 px-3 py-2 bg-surface border border-border text-muted rounded-lg text-xs font-mono hover:text-txt disabled:opacity-40 transition-all">
          <SkipForward size={12} /> Skip
        </button>
        <button onClick={reset}
          className="flex items-center gap-2 px-3 py-2 bg-surface border border-border text-muted rounded-lg text-xs font-mono hover:text-txt transition-all">
          <RotateCcw size={12} /> Reset
        </button>
        {curStep && (
          <motion.span key={step} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}}
            className="text-xs text-muted ml-2 font-mono italic">{curStep.desc}</motion.span>
        )}
      </div>

      {/* Terminal */}
      <div className="bg-[#010409] border border-border rounded-xl px-5 py-3 font-mono text-sm min-h-[48px] flex items-center gap-2">
        <span className="text-green select-none">$</span>
        <span className="text-txt">{typedCmd}</span>
        <span className="cursor-blink" />
      </div>

      {/* 3 zones */}
      <div className="grid grid-cols-3 gap-4">
        {/* Working Dir */}
        <Zone label="Working Directory" color="red" sublabel="make changes">
          {FILES.map((f, i) => (
            <FileChip key={i} file={f} status={staged.includes(i) ? 'staged' : committed.includes(i) ? 'clean' : 'modified'} />
          ))}
        </Zone>

        {/* Staging */}
        <Zone label="Staging Area" color="yellow" sublabel="git add">
          <AnimatePresence>
            {FILES.filter((_, i) => staged.includes(i)).map((f, i) => (
              <motion.div key={f.name} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <FileChip file={f} status="staged" />
              </motion.div>
            ))}
          </AnimatePresence>
          {staged.length === 0 && <p className="text-xs text-muted/40 font-mono italic">empty</p>}
        </Zone>

        {/* Repo */}
        <Zone label="Repository" color="green" sublabel="git commit">
          <AnimatePresence>
            {commits.map((c, i) => (
              <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
                className="flex items-center gap-2 bg-green/10 border border-green/30 rounded-lg px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-green glow-green" />
                <span className="font-mono text-xs text-green">{c.hash}</span>
                <span className="text-xs text-muted truncate">{c.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {commits.length === 0 && <p className="text-xs text-muted/40 font-mono italic">no commits yet</p>}
        </Zone>
      </div>

      {/* Step progress */}
      <div className="flex gap-1.5 items-center">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-green' : 'bg-border'}`} />
        ))}
      </div>
    </div>
  )
}

function Zone({ label, color, sublabel, children }) {
  const colors = { red:'border-red/30 bg-red/5', yellow:'border-yellow/30 bg-yellow/5', green:'border-green/30 bg-green/5' }
  const textColors = { red:'text-red', yellow:'text-yellow', green:'text-green' }
  return (
    <div className={`border rounded-xl p-4 min-h-[160px] ${colors[color]}`}>
      <div className={`font-mono text-xs font-bold mb-1 ${textColors[color]}`}>{label}</div>
      <div className="text-[10px] text-muted mb-3 font-mono">{sublabel}</div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function FileChip({ file, status }) {
  const statusColor = { modified:'text-red border-red/30 bg-red/5', staged:'text-yellow border-yellow/30 bg-yellow/5', clean:'text-green border-green/30 bg-green/5' }
  return (
    <div className={`flex items-center gap-2 border rounded-lg px-2 py-1.5 text-xs font-mono transition-all ${statusColor[status]}`}>
      <span>{file.icon}</span>
      <span className="truncate">{file.name}</span>
    </div>
  )
}
