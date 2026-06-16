import { useEffect, useState } from 'react'

export function TypingLine({ prompt = '$', cmd, outputs = [], speed = 38, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setShowOutput(false)
    const t = setInterval(() => {
      if (i < cmd.length) {
        setDisplayed(cmd.slice(0, ++i))
      } else {
        clearInterval(t)
        setTimeout(() => {
          setShowOutput(true)
          onDone?.()
        }, 250)
      }
    }, speed)
    return () => clearInterval(t)
  }, [cmd])

  return (
    <div className="font-mono text-sm leading-relaxed">
      <div className="flex items-center gap-2">
        <span className="text-green select-none">{prompt}</span>
        <span className="text-txt">{displayed}</span>
        {displayed.length < cmd.length && <span className="cursor-blink" />}
      </div>
      {showOutput && outputs.map((o, i) => (
        <div
          key={i}
          className={`pl-4 mt-0.5 text-xs ${
            o.startsWith('+') ? 'text-green' :
            o.startsWith('-') ? 'text-red' :
            o.startsWith('[') ? 'text-green' :
            o.startsWith('On branch') || o.startsWith('hint') ? 'text-blue' :
            'text-muted'
          }`}
        >
          {o}
        </div>
      ))}
    </div>
  )
}

export default function Terminal({ lines = [], className = '' }) {
  return (
    <div className={`bg-[#010409] border border-border rounded-lg p-4 font-mono text-sm space-y-2 ${className}`}>
      {lines.length === 0
        ? <span className="text-muted">$ <span className="cursor-blink" /></span>
        : lines.map((l, i) => (
          <div key={i}>
            <span className="text-green">$ </span>
            <span className="text-txt">{l.cmd}</span>
            {l.out && <div className="text-muted pl-4 mt-0.5 text-xs">{l.out}</div>}
          </div>
        ))
      }
    </div>
  )
}
