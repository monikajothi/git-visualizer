import { useState, useEffect, useRef } from 'react'
import SectionWrapper from './SectionWrapper'
import Badge from '../ui/Badge'
import CommandExplorer from '../ui/CommandExplorer'
import InterviewPanel from '../ui/InterviewPanel'
// Terminal component replaced by TerminalDemo for interactive demo
import TerminalDemo from '../ui/TerminalDemo'
import CopyableCode from '../ui/CopyableCode'
import { content } from '../../data/content'
import { interviewQA, quickFacts } from '../../data/interviewData'

const d = content.github

// ── Utility Components ──────────────────────────────────────────────────────

function Card({ children, className = '', animate = false, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!animate) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [animate])

  const style = animate
    ? {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }
    : {}

  return (
    <div
      ref={ref}
      style={style}
      className={`bg-surface border border-border rounded-xl p-5 ${className}`}
    >
      {children}
    </div>
  )
}

function H({ children }) {
  return (
    <h2 className="font-mono text-xs font-semibold tracking-widest text-muted uppercase mb-4">
      // {children}
    </h2>
  )
}

function StepBadge({ n, color = 'purple' }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 bg-${color}/10 text-${color}`}
    >
      {n}
    </span>
  )
}

function Tag({ children }) {
  return (
    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
      {children}
    </span>
  )
}

// ── Animated feature card for the platform overview ─────────────────────────
function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  function toggleExpand() { setExpanded(e => !e) }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleExpand()
    }
  }

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onKeyDown={onKey}
      onClick={toggleExpand}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={expanded}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered ? 'translateY(-3px)' : 'translateY(0)'
          : 'translateY(20px)',
        transition: `opacity 0.4s ease ${index * 60}ms, transform 0.25s ease`,
        borderColor: hovered || expanded ? feature.color + '55' : undefined,
        boxShadow: hovered || expanded ? `0 0 0 1px ${feature.color}22` : undefined,
        cursor: 'pointer',
      }}
      className={`bg-surface border border-border rounded-xl p-4 ${expanded ? 'ring-2 ring-offset-2' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{feature.icon}</span>
        <div className="flex-1">
          <div className="font-mono text-sm font-semibold text-txt">{feature.name}</div>
          <div className="text-[10px] text-muted">Click to {expanded ? 'collapse' : 'expand'}</div>
        </div>
      </div>
      <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
      {expanded && (
        <div className="mt-3 text-[11px] text-txt bg-black/10 p-3 rounded-md">
          <div>More about {feature.name}:</div>
          <div className="text-[12px] mt-1">{feature.desc}</div>
        </div>
      )}
    </div>
  )
}

// ── SSH Step timeline ────────────────────────────────────────────────────────
function SSHTimeline() {
  const allSteps = [
    ...d.ssh.steps.generating.map(s => ({ label: 'Generate key', ...s })),
    ...d.ssh.steps.addingToAgent.map(s => ({ label: 'Add to agent', ...s })),
    ...d.ssh.steps.addingToGithub.map(s => ({ label: 'Add to GitHub', ...s })),
    { step: 5, label: 'Test', desc: d.ssh.steps.testing.desc || 'Verify connection', cmd: d.ssh.steps.testing.cmd },
  ]

  return (
    <div className="relative pl-6 space-y-5">
      <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
      {allSteps.map((s, i) => (
        <StepRow key={i} index={i} step={s} />
      ))}
    </div>
  )
}

function StepRow({ step, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-12px)',
        transition: `opacity 0.35s ease ${index * 80}ms, transform 0.35s ease ${index * 80}ms`,
      }}
      className="relative"
    >
      <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-purple border-2 border-bg" />
      <div className="text-[10px] font-mono text-purple mb-0.5 uppercase tracking-wider">{step.label}</div>
      <p className="text-xs text-txt mb-1">{step.desc}</p>
      {step.cmd && (
        <div className="mt-1">
          <CopyableCode code={`$ ${step.cmd}`} />
        </div>
      )}
    </div>
  )
}

// ── SSH vs HTTPS comparison table ───────────────────────────────────────────
function CompareTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 font-mono text-muted font-normal">Aspect</th>
            <th className="text-left py-2 pr-4 font-mono text-purple font-semibold">SSH</th>
            <th className="text-left py-2 font-mono text-blue-400 font-semibold">HTTPS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/40">
              <td className="py-2 pr-4 text-muted">{r.aspect}</td>
              <td className="py-2 pr-4 text-txt">{r.ssh}</td>
              <td className="py-2 text-txt">{r.https}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── PR merge methods ─────────────────────────────────────────────────────────
function MergeMethods() {
  const [active, setActive] = useState(0)
  const methods = d.pullRequests.merging

  const diagrams = [
    // Merge commit — full history
    { lines: ['main:    A──B──────────M', '              \\      /', 'feat:    C──D──E'] },
    // Squash & merge
    { lines: ['main:    A──B────────(CDE)', 'feat:    C──D──E → squashed'] },
    // Rebase & merge — linear
    { lines: ["main:    A──B──C'──D'──E'", 'feat:    C──D──E → replayed'] },
  ]

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {methods.map((m, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              transition: 'all 0.2s ease',
              background: active === i ? 'rgb(139 92 246 / 0.15)' : undefined,
              borderColor: active === i ? 'rgb(139 92 246 / 0.5)' : undefined,
              color: active === i ? 'rgb(167 139 250)' : undefined,
            }}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border text-muted"
          >
            {m.method}
          </button>
        ))}
      </div>
      <div
        style={{ transition: 'opacity 0.2s ease' }}
        className="bg-black/30 rounded-xl p-4"
      >
        <p className="text-xs text-muted mb-3">{methods[active].desc}</p>
        <div className="font-mono text-[11px] text-green-400 space-y-0.5">
          {diagrams[active].lines.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  )
}

// ── Release timeline ─────────────────────────────────────────────────────────
function ReleaseTimeline() {
  const versions = [
    { tag: 'v1.0.0', type: 'MAJOR', desc: 'Breaking API change — users must update', color: '#f85149' },
    { tag: 'v1.1.0', type: 'MINOR', desc: 'New feature added, backward compatible', color: '#e3b341' },
    { tag: 'v1.1.1', type: 'PATCH', desc: 'Bug fix, nothing changed for existing users', color: '#3fb950' },
  ]

  return (
    <div className="space-y-3">
      {versions.map((v, i) => (
        <ReleaseRow key={i} v={v} index={i} />
      ))}
    </div>
  )
}

function ReleaseRow({ v, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
        transition: `opacity 0.4s ease ${index * 100}ms, transform 0.4s ease ${index * 100}ms`,
      }}
      className="flex items-center gap-3 bg-surface border border-border rounded-xl p-3"
    >
      <div
        className="font-mono text-xs font-bold px-2 py-1 rounded-lg shrink-0"
        style={{ background: v.color + '22', color: v.color }}
      >
        {v.tag}
      </div>
      <div>
        <span
          className="text-[10px] font-mono font-semibold uppercase tracking-wider mr-2"
          style={{ color: v.color }}
        >
          {v.type}
        </span>
        <span className="text-xs text-muted">{v.desc}</span>
      </div>
    </div>
  )
}

// ── Hooks explainer ──────────────────────────────────────────────────────────
function HooksGrid() {
  const hooks = [
    { name: 'pre-commit', side: 'client', when: 'Before commit is created', use: 'Run linter / formatter', icon: '🔍' },
    { name: 'commit-msg', side: 'client', when: 'After you type commit message', use: 'Enforce message format', icon: '✍️' },
    { name: 'pre-push', side: 'client', when: 'Before you push', use: 'Run tests locally', icon: '🚀' },
    { name: 'pre-receive', side: 'server', when: 'Before server accepts push', use: 'Block bad pushes centrally', icon: '🛡️' },
    { name: 'post-receive', side: 'server', when: 'After push accepted', use: 'Trigger CI/CD pipeline', icon: '⚙️' },
  ]

  return (
    <div className="space-y-2">
      <div className="flex gap-3 mb-3">
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">client-side</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">server-side</span>
      </div>
      {hooks.map((h, i) => (
        <HookRow key={i} h={h} index={i} />
      ))}
    </div>
  )
}

function HookRow({ h, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const isServer = h.side === 'server'

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.3s ease ${index * 70}ms, transform 0.3s ease ${index * 70}ms`,
      }}
      className="flex items-start gap-3 bg-surface border border-border rounded-xl p-3"
    >
      <span className="text-lg shrink-0">{h.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <code className="text-xs font-mono text-txt">{h.name}</code>
          <span
            className={`text-[10px] font-mono px-1.5 py-px rounded-full ${
              isServer
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'bg-purple/10 text-purple border border-purple/20'
            }`}
          >
            {h.side}
          </span>
        </div>
        <p className="text-[11px] text-muted">{h.when} → <span className="text-txt">{h.use}</span></p>
      </div>
    </div>
  )
}

// ── Pages visual flow ─────────────────────────────────────────────────────────
function PagesFlow() {
  const steps = [
    { icon: '📁', label: 'Create repo', note: 'username.github.io' },
    { icon: '⚙️', label: 'Settings → Pages', note: 'Choose source branch' },
    { icon: '🌐', label: 'Live URL', note: 'Auto-deployed on push' },
  ]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="bg-surface border border-border rounded-xl px-4 py-3 text-center min-w-[100px]">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-xs font-semibold text-txt">{s.label}</div>
            <div className="text-[10px] text-muted mt-0.5">{s.note}</div>
          </div>
          {i < steps.length - 1 && (
            <span className="text-muted text-sm font-mono">→</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Issues lifecycle ──────────────────────────────────────────────────────────
function IssueLifecycle() {
  const stages = [
    { label: 'Open', color: '#3fb950', desc: 'Bug filed with labels + assignee' },
    { label: 'In Progress', color: '#e3b341', desc: 'Dev branches off, links issue' },
    { label: 'PR Opened', color: '#58a6ff', desc: 'PR description says closes #42' },
    { label: 'Merged', color: '#bc8cff', desc: 'Issue auto-closed on merge' },
  ]

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {stages.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="text-[11px] font-mono px-3 py-1.5 rounded-full font-semibold"
            style={{ background: s.color + '22', color: s.color }}
          >
            {s.label}
          </div>
          {i < stages.length - 1 && <span className="text-muted text-xs">→</span>}
        </div>
      ))}
      <p className="w-full text-xs text-muted mt-2">
        Use <code className="text-purple">closes #42</code> in your PR description — GitHub auto-closes the issue on merge.
      </p>
    </div>
  )
}

// ── Actions explainer ─────────────────────────────────────────────────────────
function ActionsExplainer() {
  const yaml = `# .github/workflows/ci.yml
name: CI Pipeline
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install deps
        run: npm install
      - name: Run tests
        run: npm test
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh`

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">Trigger → Event → Workflow → Jobs → Steps. Stored in <code className="text-purple">.github/workflows/</code></p>
      <CopyableCode code={yaml} language="yaml" />
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Trigger', val: 'push / PR / schedule' },
          { label: 'Runner', val: 'ubuntu / windows / mac' },
          { label: 'Output', val: 'build artifact / deploy' },
        ].map((item, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-2 text-center">
            <div className="text-[10px] text-muted font-mono uppercase mb-0.5">{item.label}</div>
            <div className="text-[11px] text-txt font-semibold">{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Branch Protection explainer ───────────────────────────────────────────────
function BranchProtection() {
  const rules = [
    { rule: 'Require PR before merging', desc: 'No direct pushes to main' },
    { rule: 'Require status checks', desc: 'CI must pass before merge' },
    { rule: 'Require review approvals', desc: 'Min 1-2 reviewers must approve' },
    { rule: 'Dismiss stale reviews', desc: 'New push → re-review needed' },
    { rule: 'Restrict who can push', desc: 'Only admins / release bots' },
  ]

  return (
    <div className="space-y-2">
      {rules.map((r, i) => (
        <div key={i} className="flex gap-3 items-start text-xs">
          <span className="text-green-400 mt-0.5 shrink-0">✓</span>
          <div>
            <span className="text-txt font-medium">{r.rule}</span>
            <span className="text-muted ml-2">— {r.desc}</span>
          </div>
        </div>
      ))}
      <p className="text-[11px] text-muted mt-3 pt-3 border-t border-border">
        Set in: <code className="text-purple">Repo Settings → Branches → Branch protection rules</code>
      </p>
    </div>
  )
}

// ── PAT + Credential section ──────────────────────────────────────────────────
function CredentialSection() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted mb-2">Personal Access Token (PAT) — replaces password for HTTPS auth.</p>
        <div className="space-y-1">
          {d.https.authentication.PAT.steps.map((s, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <StepBadge n={i + 1} />
              <span className="text-txt pt-0.5">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-black/30 rounded-xl p-4 space-y-2">
        <p className="text-[10px] font-mono text-muted uppercase tracking-wider">Credential caching</p>
        <CopyableCode code={`$ ${d.https.authentication.credentialCaching.withTimeout}`} />
        <CopyableCode code={`$ ${d.https.authentication.credentialCaching.permanently}`} />
      </div>
    </div>
  )
}

// ── MAIN VISUAL CONTENT ───────────────────────────────────────────────────────
const VisualContent = () => (
  <div className="space-y-10">

    {/* Hero */}
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🐙</span>
        <h1 className="font-mono font-bold text-2xl text-txt">GitHub Essentials</h1>
        <Badge color="purple">Done</Badge>
      </div>
      <p className="text-sm text-muted">
        Forks, pull requests, issues, releases and CI with GitHub Actions — collaborate effectively using GitHub platform features.
      </p>
    </div>

    {/* Terminal demo */}
    <div>
      <H>Quick Demo — full contribution flow</H>
      <Card>
        <TerminalDemo lines={d.demoTerminal.lines} />
      </Card>
    </div>

    {/* Platform features grid */}
    <div>
      <H>Platform Overview</H>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {d.overview.features.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} />
        ))}
      </div>
    </div>

    {/* Branch protection */}
    <div>
      <H>Branch Protection Rules</H>
      <Card animate delay={0}>
        <BranchProtection />
      </Card>
    </div>

    {/* SSH Setup */}
    <div>
      <H>SSH Setup</H>
      <Card animate delay={0}>
        <p className="text-xs text-muted mb-4">
          {d.ssh.howItWorks}
        </p>
        <SSHTimeline />
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wider">Troubleshooting</p>
          {d.ssh.steps.troubleshooting.map((t, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <span className="text-red-400 shrink-0">!</span>
              <span className="text-muted">{t.issue}</span>
              <span className="text-muted">→</span>
              <code className="text-purple">{t.fix}</code>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* SSH vs HTTPS */}
    <div>
      <H>SSH vs HTTPS</H>
      <Card animate delay={0}>
        <CompareTable rows={d.https.sshVsHttps} />
      </Card>
    </div>

    {/* HTTPS + PAT */}
    <div>
      <H>HTTPS Auth & Personal Access Tokens</H>
      <Card animate delay={0}>
        <CredentialSection />
      </Card>
    </div>

    {/* Pull Requests */}
    <div>
      <H>Pull Requests — merge strategies</H>
      <Card animate delay={0}>
        <MergeMethods />
        <div className="mt-4 pt-4 border-t border-border space-y-1">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">PR Review checklist</p>
          {d.pullRequests.reviewing.map((r, i) => (
            <div key={i} className="flex gap-2 text-xs text-muted">
              <span className="text-purple shrink-0">→</span>{r}
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Issues lifecycle */}
    <div>
      <H>GitHub Issues — lifecycle</H>
      <Card animate delay={0}>
        <IssueLifecycle />
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">Search syntax</p>
          <CopyableCode code={'is:open is:issue label:bug assignee:@me'} />
        </div>
      </Card>
    </div>

    {/* GitHub Actions */}
    <div>
      <H>GitHub Actions — CI/CD</H>
      <Card animate delay={0}>
        <ActionsExplainer />
      </Card>
    </div>

    {/* Pages */}
    <div>
      <H>GitHub Pages</H>
      <Card animate delay={0}>
        <PagesFlow />
        <div className="mt-4 pt-4 border-t border-border space-y-1">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-1">Advanced</p>
          {d.pages.advanced.map((a, i) => (
            <div key={i} className="text-xs text-muted flex gap-2">
              <span className="text-purple shrink-0">→</span>
              <span><span className="text-txt">{a.title}</span> — {a.desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Releases + SemVer */}
    <div>
      <H>Releases & Semantic Versioning</H>
      <Card animate delay={0}>
        <ReleaseTimeline />
        <div className="mt-4 pt-4 border-t border-border space-y-1">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">Create a release via CLI</p>
          <CopyableCode code={'$ git tag -a v1.0.0 -m "First stable release"'} />
          <CopyableCode code={'$ git push origin v1.0.0'} />
        </div>
      </Card>
    </div>

    {/* Wiki */}
    <div>
      <H>GitHub Wiki</H>
      <Card animate delay={0}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">Features</p>
            {d.wiki.features.map((f, i) => (
              <div key={i} className="text-xs text-muted flex gap-2 mb-1">
                <span className="text-purple">→</span>{f}
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">Typical structure</p>
            {d.wiki.structure.map((s, i) => (
              <div key={i} className="text-xs text-muted flex gap-2 mb-1">
                <span className="text-purple">→</span>{s}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <CopyableCode code={'$ git clone <repo-url>.wiki.git'} />
        </div>
      </Card>
    </div>

    {/* Commands */}
    <div>
      <H>Common GitHub CLI Commands</H>
      <CommandExplorer commands={d.commands.map(c => ({ cmd: c.cmd, desc: c.desc }))} />
    </div>

    {/* Best practices */}
    <div>
      <H>Best Practices</H>
      <Card animate delay={0}>
        <div className="space-y-2">
          {d.bestPractices.map((p, i) => (
            <div key={i} className="text-xs text-muted flex gap-2">
              <span className="text-purple">→</span>{p}
            </div>
          ))}
        </div>
      </Card>
    </div>

  </div>
)

export default function GitHubEssentialsSection() {
  return (
    <SectionWrapper
      id="github"
      tabs={[
        { id: 'visual', label: 'Visual Guide', icon: '🐙', content: <VisualContent /> },
        {
          id: 'interview',
          label: 'Interview Prep',
          icon: '🧠',
          content: (
            <InterviewPanel
              questions={interviewQA.github}
              quickFacts={quickFacts.github}
            />
          ),
        },
      ]}
    />
  )
}