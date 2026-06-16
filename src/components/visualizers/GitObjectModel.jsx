import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const OBJECTS = {
  blob: {
    color: '#58a6ff', label: 'Blob', icon: '📦',
    desc: 'Stores raw file content. Identified by SHA-1 hash. Doesn\'t know filename or path — just pure content.',
    detail: ['Content-addressable: same content = same hash', 'Compressed with zlib', 'Immutable once created', 'Stored in .git/objects/'],
    example: 'sha1("blob 12\\0Hello World") = 8ab686...',
  },
  tree: {
    color: '#3fb950', label: 'Tree', icon: '🌳',
    desc: 'Represents a directory. Contains pointers to blobs (files) and other trees (subdirectories).',
    detail: ['Maps filenames to blob/tree SHAs', 'Stores file permissions (100644, 100755)', 'Hierarchical — mirrors directory structure', 'Each commit points to a root tree'],
    example: '100644 blob 8ab686 README.md\n100755 blob 3f4a12 script.sh\n040000 tree 9cd321 src/',
  },
  commit: {
    color: '#bc8cff', label: 'Commit', icon: '💾',
    desc: 'Snapshot of project at a point in time. Points to a tree + parent commit(s). Contains metadata.',
    detail: ['Points to root tree object', 'Points to parent commit(s)', 'SHA-1 = fingerprint of entire snapshot', 'Immutable — changing anything creates new hash'],
    example: 'tree 9cd321...\nparent 4a2f1c...\nauthor Dev <dev@ex.com> 1718000000\ncommitter Dev <dev@ex.com> 1718000000\n\nfeat: add login page',
  },
  tag: {
    color: '#e3b341', label: 'Tag', icon: '🏷️',
    desc: 'Named pointer to a commit. Used to mark releases. Annotated tags store extra metadata.',
    detail: ['Lightweight tag: just a named ref', 'Annotated tag: full object with message', 'Used for version releases (v1.0.0)', 'Points to specific commit — doesn\'t move'],
    example: 'object 4a2f1c...\ntype commit\ntag v1.0.0\ntagger Dev <dev@ex.com>\n\nRelease version 1.0.0',
  },
}

export default function GitObjectModel() {
  const [active, setActive] = useState('commit')

  const obj = OBJECTS[active]

  return (
    <div className="space-y-4">
      {/* Node diagram */}
      <div className="relative bg-[#010409] border border-border rounded-xl p-8 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #e6edf3 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative flex items-center justify-center gap-0">
          {/* Blob */}
          <div className="flex flex-col items-center gap-2">
            <ObjectNode id="blob" active={active} setActive={setActive} obj={OBJECTS.blob} />
            <span className="text-[10px] font-mono text-muted">file content</span>
          </div>

          <Arrow />

          {/* Tree */}
          <div className="flex flex-col items-center gap-2">
            <ObjectNode id="tree" active={active} setActive={setActive} obj={OBJECTS.tree} />
            <span className="text-[10px] font-mono text-muted">directory</span>
          </div>

          <Arrow />

          {/* Commit */}
          <div className="flex flex-col items-center gap-2">
            <ObjectNode id="commit" active={active} setActive={setActive} obj={OBJECTS.commit} />
            <span className="text-[10px] font-mono text-muted">snapshot</span>
          </div>

          <Arrow />

          {/* Tag */}
          <div className="flex flex-col items-center gap-2">
            <ObjectNode id="tag" active={active} setActive={setActive} obj={OBJECTS.tag} />
            <span className="text-[10px] font-mono text-muted">release</span>
          </div>
        </div>

        {/* parent self-arrow for commit */}
        <div className="absolute bottom-4 right-1/2 translate-x-16 text-xs font-mono text-purple/60">
          ↺ parent commit
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="border rounded-xl overflow-hidden"
          style={{ borderColor: obj.color + '44' }}>

          <div className="flex items-center gap-3 px-5 py-3 border-b"
            style={{ borderColor: obj.color + '33', background: obj.color + '11' }}>
            <span className="text-xl">{obj.icon}</span>
            <span className="font-mono font-bold text-sm" style={{ color: obj.color }}>{obj.label}</span>
            <span className="text-xs text-muted ml-auto">Click any node above</span>
          </div>

          <div className="grid grid-cols-2 gap-0">
            <div className="p-5 border-r border-border">
              <p className="text-sm text-muted leading-relaxed mb-4">{obj.desc}</p>
              <ul className="space-y-2">
                {obj.detail.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted">
                    <span style={{ color: obj.color }} className="mt-0.5 shrink-0">→</span>{d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 bg-[#010409]">
              <div className="font-mono text-[10px] text-muted mb-2">// Example</div>
              <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap" style={{ color: obj.color }}>
                {obj.example}
              </pre>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ObjectNode({ id, active, setActive, obj }) {
  const isActive = active === id
  return (
    <motion.button
      onClick={() => setActive(id)}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
      className="relative flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 font-mono text-xs font-bold transition-all cursor-pointer"
      style={{
        borderColor: obj.color + (isActive ? 'ff' : '66'),
        background: obj.color + (isActive ? '33' : '11'),
        color: obj.color,
        boxShadow: isActive ? `0 0 24px ${obj.color}55` : 'none',
      }}
    >
      <span className="text-xl leading-none">{obj.icon}</span>
      {isActive && (
        <motion.div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
          style={{ background: obj.color }}
          layoutId="indicator" />
      )}
    </motion.button>
  )
}

function Arrow() {
  return (
    <div className="flex items-center px-3">
      <div className="w-8 h-px bg-border relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0"
          style={{ borderLeft: '6px solid #30363d', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
      </div>
    </div>
  )
}
