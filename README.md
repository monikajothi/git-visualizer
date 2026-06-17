# 🌳 Git Visualizer

> An interactive React app for learning Git through visual explanations, command examples, handwritten-notes PDFs, and interview prep. 🚀

🔗 **Live demo:** [monikajothi.github.io/git-visualizer](https://monikajothi.github.io/git-visualizer/)

📦 **Repo:** [github.com/monikajothi/git-visualizer](https://github.com/monikajothi/git-visualizer)

![Deploy Status](https://github.com/monikajothi/git-visualizer/actions/workflows/deploy.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🧭 **Topic-based Git sections** — intro, basics, history, files, undoing changes, branching, remotes, merge/rebase, GitHub essentials, and advanced Git.
- 🎞️ **Animated visualizers** for core concepts like the staging area, branch graphs, Git objects, and undo workflows.
- 🧠 **Built-in interview prep** — curated questions and quick facts for every section.
- 📄 **Inline PDF viewer** for handwritten notes stored in `public/notes`.
- 💾 **Persistent app state** with Zustand, so visited sections are remembered.
- 🌑 **Dark, GitHub-inspired UI** built with Tailwind CSS, Framer Motion, and Lucide icons.

---

## 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| ⚛️ Frontend | React 18 |
| ⚡ Build | Vite |
| 🎨 Styling | Tailwind CSS |
| 🗃️ State | Zustand |
| 🎬 Animation | Framer Motion |
| 📑 PDFs | React PDF |
| 🧩 Icons | Lucide React |

---

## 🚀 Getting Started

**1️⃣ Install dependencies**

```bash
npm install
```

**2️⃣ Start the local dev server**

```bash
npm run dev
```

App runs at:

```text
http://localhost:5173
```

**3️⃣ Create a production build**

```bash
npm run build
```

**4️⃣ Preview the production build**

```bash
npm run preview
```

---

## 🌐 Deployment — GitHub Pages + GitHub Actions

This project is deployed automatically to **GitHub Pages** 🎉 using a **GitHub Actions** workflow — every push to `main` triggers a fresh build and deploy, no manual steps needed.

**🔄 How it works:**

1. Push or merge to the `main` branch.
2. The workflow at `.github/workflows/deploy.yml` spins up, runs `npm install` and `npm run build`.
3. The generated `dist/` folder is published to the `gh-pages` branch (or the Pages environment).
4. The live site updates at 👉 **https://monikajothi.github.io/git-visualizer/**

**📝 Sample workflow** (adjust if yours differs):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4

      - name: 🟢 Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 📦 Install dependencies
        run: npm install

      - name: 🏗️ Build
        run: npm run build

      - name: 📤 Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

      - name: 🚀 Deploy
        uses: actions/deploy-pages@v4
```

> ⚠️ **Heads up:** The Vite `base` path is set to `/git-visualizer/` in `vite.config.js` — this must match your repo name exactly, or assets will 404 on Pages.

---

## 📁 Project Structure

```text
src/
  App.jsx                         # 🧭 Main layout and section routing
  main.jsx                        # 🚪 React entry point
  index.css                       # 🎨 Tailwind imports and global styles

  components/
    layout/
      Sidebar.jsx                 # 📌 Section navigation, search, and progress
      TopBar.jsx                  # 🏷️ Active section header

    sections/
      IntroSection.jsx
      BasicsSection.jsx
      HistorySection.jsx
      FilesSection.jsx
      UndoingSection.jsx
      BranchesSection.jsx
      RemoteSection.jsx
      MergeSection.jsx
      GitHubEssentialsSection.jsx
      AdvancedSection.jsx
      SectionWrapper.jsx          # 🧱 Shared tab layout and notes PDF tab

    ui/
      Badge.jsx
      CommandExplorer.jsx
      InterviewPanel.jsx
      PdfViewer.jsx
      Terminal.jsx
      TerminalDemo.jsx

    visualizers/
      BranchGraph.jsx
      GitObjectModel.jsx
      StagingFlow.jsx
      UndoDecisionTree.jsx

  data/
    sections.js                   # 🗂️ Section registry and PDF mappings
    content.js                    # 📚 Structured learning content
    interviewData.js              # 🧠 Interview questions and quick facts

  store/
    useAppStore.js                # 💾 Zustand store with persistence

public/
  notes/                          # 📄 Handwritten-note PDFs used by the app
```

---

## 🧩 How Sections Work

Sections are registered in `src/data/sections.js`. Each entry defines the section `id`, `label`, `icon`, `color`, `status`, PDF path, and description.

`src/App.jsx` maps each section id to a React section component. `SectionWrapper.jsx` renders the shared tab shell and automatically adds a **"My Notes" 📝** tab whenever a section has a PDF configured.

---

## 📌 Notes

- 📄 PDF paths are relative to `public`, e.g. `notes/Basics_.pdf`.
- ⚙️ The Vite base path is configured as `/git-visualizer/` in `vite.config.js` — required for correct asset loading on GitHub Pages.
- 🔁 Every merge to `main` redeploys automatically via GitHub Actions — just push and the live site updates itself. ✅

---

<p align="center">Made with 💙 for anyone trying to actually <i>understand</i> Git, not just memorize it.</p>