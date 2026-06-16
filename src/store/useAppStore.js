import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      activeSection: 'intro',
      visitedSections: [],
      searchQuery: '',
      extractedContent: {},
      setActiveSection: (id) => set(s => ({
        activeSection: id,
        visitedSections: s.visitedSections.includes(id) ? s.visitedSections : [...s.visitedSections, id],
      })),
      setSearchQuery: (q) => set({ searchQuery: q }),
      saveExtractedContent: (id, data) => set(s => ({ extractedContent: { ...s.extractedContent, [id]: data } })),
      getExtractedContent: (id) => get().extractedContent[id] ?? null,
      clearExtractedContent: (id) => set(s => { const n={...s.extractedContent}; delete n[id]; return { extractedContent: n } }),
    }),
    { name: 'git-viz-store', partialize: s => ({ visitedSections: s.visitedSections, extractedContent: s.extractedContent }) }
  )
)
export default useAppStore
