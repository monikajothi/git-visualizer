import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'

const COMMITS = [
  { id:'c1', x:80,  y:140, label:'c1', branch:'main',    color:'#3fb950', msg:'Initial commit' },
  { id:'c2', x:180, y:140, label:'c2', branch:'main',    color:'#3fb950', msg:'Add README' },
  { id:'c3', x:280, y:140, label:'c3', branch:'main',    color:'#3fb950', msg:'Setup project' },
  { id:'c4', x:380, y:80,  label:'c4', branch:'feature', color:'#58a6ff', msg:'Start feature', parent:'c3', branchFrom:'c3' },
  { id:'c5', x:480, y:80,  label:'c5', branch:'feature', color:'#58a6ff', msg:'Feature WIP',   parent:'c4' },
  { id:'c6', x:380, y:200, label:'c6', branch:'hotfix',  color:'#f78166', msg:'Fix prod bug',  parent:'c3', branchFrom:'c3' },
  { id:'c7', x:580, y:80,  label:'c7', branch:'feature', color:'#58a6ff', msg:'Feature done',  parent:'c5' },
  { id:'c8', x:480, y:140, label:'c8', branch:'main',    color:'#3fb950', msg:'Merge hotfix',  parent:'c3', merge:'c6', mergeColor:'#f78166' },
  { id:'M',  x:680, y:140, label:'M',  branch:'main',    color:'#bc8cff', msg:'Merge feature', parent:'c8', merge:'c7', mergeColor:'#58a6ff' },
]

const CMDS = [
  'git init && git commit -m "Initial commit"',
  'git commit -m "Add README"',
  'git commit -m "Setup project"',
  'git checkout -b feature',
  'git commit -m "Feature WIP"',
  'git checkout -b hotfix main',
  'git commit -m "Feature done"',
  'git checkout main && git merge hotfix',
  'git merge feature   # merge commit',
]

export default function BranchGraph() {
  const canvasRef = useRef(null)
  const [step, setStep] = useState(0)
  const [cmd, setCmd] = useState('')
  const [running, setRunning] = useState(false)
  const timerRef = useRef(null)

  const draw = (upTo) => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const shown = COMMITS.slice(0, upTo)

    // Draw lines first
    shown.forEach(c => {
      const from = shown.find(x => x.id === c.parent)
      if (from) drawLine(ctx, from.x, from.y, c.x, c.y, c.color)
      if (c.merge) {
        const mFrom = shown.find(x => x.id === c.merge)
        if (mFrom) drawLine(ctx, mFrom.x, mFrom.y, c.x, c.y, c.mergeColor || c.color)
      }
      if (c.branchFrom) {
        const bf = shown.find(x => x.id === c.branchFrom)
        if (bf) drawLine(ctx, bf.x, bf.y, c.x, c.y, c.color)
      }
    })

    // Draw nodes
    shown.forEach((c, i) => {
      const isLatest = i === shown.length - 1
      // glow
      ctx.beginPath(); ctx.arc(c.x, c.y, isLatest ? 16 : 12, 0, Math.PI*2)
      ctx.fillStyle = c.color + '22'; ctx.fill()
      // node
      ctx.beginPath(); ctx.arc(c.x, c.y, isLatest ? 10 : 8, 0, Math.PI*2)
      ctx.fillStyle = c.color; ctx.fill()
      // label
      ctx.fillStyle = '#e6edf3'; ctx.font = 'bold 10px JetBrains Mono'
      ctx.textAlign = 'center'; ctx.fillText(c.label, c.x, c.y + 24)
      // msg on hover — just show for latest
      if (isLatest) {
        ctx.fillStyle = c.color; ctx.font = '500 10px Inter'
        ctx.fillText(c.msg, c.x, c.y - 18)
      }
    })

    // Branch labels
    const branches = {}
    shown.forEach(c => { if (!branches[c.branch] || c.x > branches[c.branch].x) branches[c.branch] = c })
    Object.entries(branches).forEach(([name, c]) => {
      ctx.fillStyle = c.color; ctx.font = 'bold 11px JetBrains Mono'
      ctx.textAlign = 'left'; ctx.fillText(name, c.x + 14, c.y + 4)
    })

    // HEAD
    if (shown.length) {
      const last = shown[shown.length - 1]
      ctx.fillStyle = '#e3b341'; ctx.font = 'bold 10px JetBrains Mono'
      ctx.textAlign = 'center'; ctx.fillText('HEAD', last.x, last.y - 28)
      ctx.beginPath(); ctx.moveTo(last.x, last.y - 20); ctx.lineTo(last.x, last.y - 13)
      ctx.strokeStyle = '#e3b341'; ctx.lineWidth = 1.5; ctx.stroke()
    }
  }

  const drawLine = (ctx, x1, y1, x2, y2, color) => {
    ctx.beginPath()
    const mx = (x1 + x2) / 2
    ctx.moveTo(x1, y1)
    ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2)
    ctx.strokeStyle = color + '99'; ctx.lineWidth = 2.5
    ctx.setLineDash([]); ctx.stroke()
    // arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1)
    ctx.beginPath()
    ctx.moveTo(x2 - 10*Math.cos(angle-0.4), y2 - 10*Math.sin(angle-0.4))
    ctx.lineTo(x2 - 4, y2)
    ctx.lineTo(x2 - 10*Math.cos(angle+0.4), y2 - 10*Math.sin(angle+0.4))
    ctx.fillStyle = color + '99'; ctx.fill()
  }

  useEffect(() => { draw(step) }, [step])
  useEffect(() => { const ro = new ResizeObserver(() => draw(step)); ro.observe(canvasRef.current); return () => ro.disconnect() }, [step])

  const typeCmd = (c, cb) => {
    setCmd(''); let i = 0
    const t = setInterval(() => { setCmd(c.slice(0,++i)); if(i>=c.length){clearInterval(t);setTimeout(cb,300)} }, 45)
  }

  const play = () => {
    setRunning(true); setStep(0); setCmd('')
    let s = 0
    const next = () => {
      if (s >= COMMITS.length) { setRunning(false); return }
      typeCmd(CMDS[s] || '', () => {
        setStep(s + 1)
        s++
        timerRef.current = setTimeout(next, 900)
      })
    }
    next()
  }
  const reset = () => { clearTimeout(timerRef.current); setStep(0); setCmd(''); setRunning(false) }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={play} disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-blue/10 border border-blue/40 text-blue rounded-lg text-xs font-mono hover:bg-blue/20 disabled:opacity-40 transition-all">
          <Play size={12} /> Animate Branches
        </button>
        <button onClick={reset}
          className="flex items-center gap-2 px-3 py-2 bg-surface border border-border text-muted rounded-lg text-xs font-mono hover:text-txt transition-all">
          <RotateCcw size={12} /> Reset
        </button>
        <div className="flex gap-3 ml-3">
          {[['main','#3fb950'],['feature','#58a6ff'],['hotfix','#f78166'],['merge','#bc8cff']].map(([n,c]) => (
            <div key={n} className="flex items-center gap-1.5 text-xs font-mono">
              <div className="w-2.5 h-2.5 rounded-full" style={{background:c}} />
              <span className="text-muted">{n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#010409] border border-border rounded-xl px-5 py-3 font-mono text-sm min-h-[44px] flex items-center gap-2">
        <span className="text-green select-none">$</span>
        <span className="text-txt">{cmd}</span>
        <span className="cursor-blink" />
      </div>

      <canvas ref={canvasRef} height={280}
        className="w-full bg-surface border border-border rounded-xl"
        style={{ display:'block' }} />

      <div className="flex gap-1.5">
        {COMMITS.map((_, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < step ? 'bg-blue' : 'bg-border'}`} />
        ))}
      </div>
    </div>
  )
}
