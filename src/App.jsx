import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import IntroSection from './components/sections/IntroSection'
import BasicsSection from './components/sections/BasicsSection'
import HistorySection from './components/sections/HistorySection'
import FilesSection from './components/sections/FilesSection'
import UndoingSection from './components/sections/UndoingSection'
import ComingSoonSection from './components/sections/ComingSoonSection'
import BranchesSection from './components/sections/BranchesSection'
import MergeSection from './components/sections/MergeSection'
import RemoteSection from './components/sections/RemoteSection'
import GitHubEssentialsSection from './components/sections/GitHubEssentialsSection'
import useAppStore from './store/useAppStore'

const sectionMap = {
  intro:    <IntroSection />,
  basics:   <BasicsSection />,
  history:  <HistorySection />,
  files:    <FilesSection />,
  undoing:  <UndoingSection />,
  branches: <BranchesSection />,
  remote:   <RemoteSection />,
  github:   <GitHubEssentialsSection />,
  merge:    <MergeSection />,
  advanced: <ComingSoonSection id="advanced" />,
}

export default function App() {
  const { activeSection } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-bg">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed md:sticky top-0 h-screen z-50 md:z-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto">
          {sectionMap[activeSection] ?? <IntroSection />}
        </main>
      </div>
    </div>
  )
}
