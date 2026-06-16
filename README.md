# Git Visualizer — Personal Notes

Interactive Git learning app with animated visualizers, interview prep, and AI-powered notes import.

## Setup

```bash
npm install
```

### Add your Anthropic API key (required for PDF import)

```bash
cp .env.example .env
# Edit .env and add your key from https://console.anthropic.com/
```

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

```bash
npm run dev
# → http://localhost:5173
```

## Adding notes for coming-soon sections

1. Finish topic → write handwritten notes as PDF
2. Drop PDF into `public/notes/<sectionid>.pdf`
   - `public/notes/branches.pdf`
   - `public/notes/remote.pdf`
   - `public/notes/merge.pdf`
   - `public/notes/advanced.pdf`
3. Open that section in app → scroll to bottom → click **"Use PDF from notes folder"**
4. Claude reads your handwriting → preview appears → click Save
5. Section fills with your content instantly ✓

## Project structure

```
src/
├── components/
│   ├── layout/        Sidebar, TopBar
│   ├── sections/      One file per section
│   ├── ui/            Badge, CodeBlock, ImportNotesButton...
│   └── visualizers/   StagingFlow, BranchGraph, GitObjectModel, UndoDecisionTree
├── data/
│   ├── content.js     All your notes content
│   ├── sections.js    Section registry
│   └── interviewData.js Interview Q&A
└── store/
    └── useAppStore.js Zustand store (saves extracted content to localStorage)
```