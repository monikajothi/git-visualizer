import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, ChevronRight } from 'lucide-react'

const TREE = {
  id: 'root',
  q: 'What do you want to undo?',
  options: [
    {
      label: 'Unstaged file changes',
      next: {
        id: 'unstaged',
        q: 'How many files?',
        options: [
          { label: 'One file', result: { cmd: 'git restore <file>', color: 'cyan', desc: 'Discards changes in working dir for that file — restores to last commit state.', safe: true } },
          { label: 'All files', result: { cmd: 'git restore .', color: 'cyan', desc: 'Discards ALL unstaged changes. Working dir reset to last commit.', safe: true } },
        ]
      }
    },
    {
      label: 'Staged changes (git add done)',
      next: {
        id: 'staged',
        q: 'What do you want to do with the changes?',
        options: [
          { label: 'Unstage but keep changes', result: { cmd: 'git restore --staged <file>', color: 'yellow', desc: 'Moves file out of staging area back to working dir. Changes are preserved.', safe: true } },
          { label: 'Unstage AND discard', result: { cmd: 'git restore --staged <file> && git restore <file>', color: 'red', desc: 'First unstages, then discards. Changes are lost.', safe: false } },
        ]
      }
    },
    {
      label: 'Last commit (not pushed)',
      next: {
        id: 'lastcommit',
        q: 'What should happen to the changes?',
        options: [
          { label: 'Keep staged', result: { cmd: 'git reset --soft HEAD~1', color: 'green', desc: 'Moves HEAD back one commit. Changes remain staged — ready to re-commit.', safe: true } },
          { label: 'Keep unstaged', result: { cmd: 'git reset HEAD~1', color: 'yellow', desc: 'Moves HEAD back. Changes go back to working dir. (default = --mixed)', safe: true } },
          { label: 'Delete completely', result: { cmd: 'git reset --hard HEAD~1', color: 'red', desc: 'Destroys the commit AND all changes. Irreversible without reflog.', safe: false } },
        ]
      }
    },
    {
      label: 'Commit already pushed',
      next: {
        id: 'pushed',
        q: 'Do you want to preserve history?',
        options: [
          { label: 'Yes — safe for team', result: { cmd: 'git revert <hash>', color: 'purple', desc: 'Creates a NEW commit that undoes the old one. History preserved. Safe for shared branches.', safe: true } },
          { label: 'No — force rewrite', result: { cmd: 'git reset --hard <hash> && git push --force', color: 'red', desc: '⚠️ DANGEROUS. Rewrites history. Coordinate with team. Can cause data loss for others.', safe: false } },
        ]
      }
    },
    {
      label: 'Untracked/temp files',
      result: { cmd: 'git clean -fd', color: 'orange', desc: 'Removes untracked files and directories. Use -n (dry-run) first to preview.', safe: false },
    },
    {
      label: 'Temporarily save work',
      result: { cmd: 'git stash', color: 'blue', desc: 'Saves uncommitted changes to a stack. Restore with git stash pop. Useful before switching branches.', safe: true },
    },
  ]
}

export default function UndoDecisionTree() {
  const [path, setPath] = useState([TREE])
  const [result, setResult] = useState(null)

  const current = path[path.length - 1]
  const reset = () => { setPath([TREE]); setResult(null) }

  const choose = (option) => {
    if (option.result) {
      setResult(option.result)
    } else if (option.next) {
      setPath(p => [...p, option.next])
    }
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 flex-wrap">
        {path.map((node, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={12} className="text-muted" />}
            <span className={`text-xs font-mono ${i === path.length - 1 ? 'text-txt' : 'text-muted'}`}>
              {i === 0 ? 'Start' : `Step ${i}`}
            </span>
          </div>
        ))}
        {result && <><ChevronRight size={12} className="text-muted" /><span className="text-xs font-mono text-green">Result</span></>}
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key={current.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-3">
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="font-mono text-xs text-muted mb-2">// Question</div>
              <h3 className="font-semibold text-txt text-base">{current.q}</h3>
            </div>
            <div className="grid gap-2">
              {current.options.map((opt, i) => (
                <motion.button key={i} onClick={() => choose(opt)}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl text-left hover:border-blue/40 hover:bg-blue/5 transition-all group">
                  <div className="w-6 h-6 rounded-full bg-surface2 border border-border flex items-center justify-center text-xs font-mono text-muted group-hover:border-blue/40 group-hover:text-blue transition-all shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-txt">{opt.label}</span>
                  <ChevronRight size={14} className="text-muted ml-auto group-hover:text-blue transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="space-y-3">
            <div className={`border rounded-xl p-6 bg-${result.color}/5`}
              style={{ borderColor: colorHex(result.color) + '44' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full`} style={{ background: colorHex(result.color) }} />
                <span className="font-mono text-xs text-muted">Recommended command</span>
                {result.safe
                  ? <span className="ml-auto text-[10px] font-mono text-green border border-green/30 bg-green/10 rounded-full px-2 py-0.5">✓ Safe</span>
                  : <span className="ml-auto text-[10px] font-mono text-red border border-red/30 bg-red/10 rounded-full px-2 py-0.5">⚠ Destructive</span>}
              </div>
              <code className="font-mono text-lg font-bold block mb-4" style={{ color: colorHex(result.color) }}>
                {result.cmd}
              </code>
              <p className="text-sm text-muted leading-relaxed">{result.desc}</p>
            </div>

            {/* Related commands */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="font-mono text-xs text-muted mb-3">// Recovery if something goes wrong</div>
              <div className="space-y-2">
                {[
                  { cmd: 'git reflog', desc: 'See all HEAD movements — find lost commits' },
                  { cmd: 'git reflog show --all', desc: 'Full reflog for all refs' },
                  { cmd: 'git reset --hard <hash>', desc: 'Jump back to any point in reflog' },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <code className="font-mono text-purple shrink-0">{r.cmd}</code>
                    <span className="text-muted">{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={reset}
        className="flex items-center gap-2 text-xs font-mono text-muted hover:text-txt transition-colors">
        <RotateCcw size={11} /> Start over
      </button>
    </div>
  )
}

function colorHex(name) {
  const map = { cyan:'#39d0d8', yellow:'#e3b341', green:'#3fb950', red:'#f85149', purple:'#bc8cff', blue:'#58a6ff', orange:'#f78166' }
  return map[name] || '#7d8590'
}
