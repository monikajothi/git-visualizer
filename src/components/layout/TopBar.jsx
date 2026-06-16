import { FileText, Menu, Sparkles, BookOpen } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { sections } from '../../data/sections'

export default function TopBar({ onMenuToggle }) {
  const { activeSection } = useAppStore()
  const sec = sections.find(s => s.id === activeSection)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-surface/95 backdrop-blur border-b border-border">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="md:hidden p-1.5 text-muted hover:text-txt transition-colors">
          <Menu size={16} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">{sec?.icon}</span>
            <h1 className="font-mono font-bold text-sm text-txt">{sec?.label ?? 'Git Visualizer'}</h1>
            {sec?.status === 'done' && (
              <span className="text-[10px] font-mono text-green border border-green/30 bg-green/10 rounded-full px-2 py-0.5">✓ Notes</span>
            )}
          </div>
          <p className="text-xs text-muted hidden sm:block mt-0.5">{sec?.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted">
          <BookOpen size={11} />
          <span>Visual + Interview + Notes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
          <span className="text-xs font-mono text-muted hidden sm:block">live</span>
        </div>
      </div>
    </header>
  )
}
