import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Eye } from 'lucide-react'
import PdfViewer from '../ui/PdfViewer'
import { sections } from '../../data/sections'

export default function SectionWrapper({ id, children, tabs = [] }) {
  const sec = sections.find(s => s.id === id)
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'visual')

  const allTabs = [
    ...tabs,
    ...(sec?.pdf ? [{ id: 'notes', label: 'My Notes', icon: '📝' }] : []),
  ]

  return (
    <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }} className="p-6 max-w-5xl mx-auto">

      {allTabs.length > 1 && (
        <div className="flex gap-1.5 mb-6 border-b border-border pb-0">
          {allTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono rounded-t-lg border border-b-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-surface border-border text-txt -mb-px'
                  : 'text-muted border-transparent hover:text-txt'
              }`}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}>
          {activeTab === 'notes' && sec?.pdf
            ? <PdfViewer src={sec.pdf} title={sec.label + ' — Handwritten Notes'} />
            : tabs.find(t => t.id === activeTab)?.content ?? children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
