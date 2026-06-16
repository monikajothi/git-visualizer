import { BookOpen, Search, GitBranch, Zap } from 'lucide-react'
import { sections } from '../../data/sections'
import useAppStore from '../../store/useAppStore'

export default function Sidebar() {
  const { activeSection, setActiveSection, visitedSections, searchQuery, setSearchQuery } = useAppStore()
  const filtered = sections.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
  const done = sections.filter(s => s.status === 'done').length

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange to-red flex items-center justify-center shadow-lg">
            <GitBranch size={15} className="text-white" />
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-txt">git-visualizer</div>
            <div className="text-[10px] text-muted font-mono">personal notes</div>
          </div>
        </div>
        {/* Progress */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-muted">Learning progress</span>
          <span className="text-[10px] font-mono text-green">{done}/{sections.length}</span>
        </div>
        <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green to-cyan rounded-full transition-all duration-700"
            style={{ width: `${(done/sections.length)*100}%` }} />
        </div>
        <div className="text-[10px] text-muted font-mono mt-1">{Math.round((done/sections.length)*100)}% complete</div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2 bg-surface2 border border-border rounded-lg px-3 py-2">
          <Search size={11} className="text-muted shrink-0" />
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
            placeholder="Search sections..."
            className="bg-transparent text-xs font-mono text-txt placeholder:text-muted outline-none w-full" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {filtered.map(s => {
          const isActive = activeSection === s.id
          const isVisited = visitedSections.includes(s.id)
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                isActive ? 'bg-surface2 border border-border shadow-sm' : 'hover:bg-surface2 border border-transparent'
              }`}>
              <span className="text-base leading-none shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium truncate transition-colors ${isActive ? 'text-txt' : 'text-muted group-hover:text-txt'}`}>
                  {s.label}
                </div>
                {isActive && <div className="text-[10px] text-muted/60 truncate">{s.description}</div>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {s.status === 'done'
                  ? <div className="w-1.5 h-1.5 rounded-full bg-green" title="Notes available" />
                  : <div className="w-1.5 h-1.5 rounded-full bg-border" title="Coming soon" />}
                {isVisited && !isActive && <div className="w-1 h-1 rounded-full bg-blue/50" />}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={10} className="text-yellow" />
          <span className="text-[10px] font-mono text-muted">Built during holiday learning 🎉</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          <span className="text-[10px] font-mono text-muted">Vite + React + Tailwind</span>
        </div>
      </div>
    </aside>
  )
}
