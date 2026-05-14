// src/components/ui.jsx — Shared UI primitives

import { clsx } from 'clsx'

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-surface2 border-border text-muted',
    green: 'bg-c-green/10 border-c-green/30 text-c-green',
    blue: 'bg-c-blue/10 border-c-blue/30 text-c-blue',
    amber: 'bg-accent/10 border-accent/30 text-accent',
    orange: 'bg-accent2/10 border-accent2/30 text-accent2',
    purple: 'bg-c-purple/10 border-c-purple/30 text-c-purple',
    red: 'bg-c-red/10 border-c-red/30 text-c-red',
  }
  return (
    <span className={clsx(
      'font-mono text-[10px] px-2 py-0.5 rounded border whitespace-nowrap',
      variants[variant], className
    )}>
      {children}
    </span>
  )
}

export function Card({ children, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-surface border border-border rounded-lg p-5 transition-colors',
        onClick && 'cursor-pointer hover:border-[#333340]',
        !onClick && 'hover:border-[#2a2a32]',
        className
      )}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, variant = 'amber' }) {
  const colors = {
    amber: 'text-accent',
    green: 'text-c-green',
    blue: 'text-c-blue',
    red: 'text-c-red',
    purple: 'text-c-purple',
  }
  return (
    <Card>
      <div className={clsx('font-syne text-3xl font-extrabold tracking-tight', colors[variant])}>
        {value}
      </div>
      <div className="text-[11px] text-muted uppercase tracking-wide mt-1">{label}</div>
      {sub && <div className="text-[11px] text-muted mt-0.5">{sub}</div>}
    </Card>
  )
}

export function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="w-8 h-0.5 bg-accent mb-3 rounded" />
        <h1 className="font-syne font-extrabold text-2xl tracking-tight">{title}</h1>
        {sub && <p className="text-muted text-sm mt-1 max-w-xl">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatusDot({ status }) {
  const colors = {
    Deployed: 'bg-c-green',
    Live: 'bg-c-green',
    Complete: 'bg-c-green',
    Active: 'bg-c-green',
    Building: 'bg-c-blue animate-pulse',
    'In Progress': 'bg-c-blue animate-pulse',
    'Assets Building': 'bg-c-blue animate-pulse',
    Pending: 'bg-accent',
    Planning: 'bg-accent',
    Backlog: 'bg-muted',
    Testing: 'bg-c-purple',
    'GHL Setup': 'bg-c-purple',
    'Bot Build': 'bg-accent animate-pulse',
    Open: 'bg-c-red',
    'Waiting on Client': 'bg-accent',
    Resolved: 'bg-c-green',
    Retired: 'bg-muted',
    Done: 'bg-c-green',
    Blocked: 'bg-c-red',
    Expired: 'bg-c-red',
    'Needs Reconnect': 'bg-c-red',
  }
  return (
    <span className={clsx('inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5', colors[status] || 'bg-muted')} />
  )
}

export function priorityBadge(priority) {
  const map = { Critical: 'red', High: 'orange', Medium: 'amber', Low: 'default' }
  return map[priority] || 'default'
}

export function stageBadge(stage) {
  const map = {
    Kickoff: 'default',
    'GHL Setup': 'purple',
    'Bot Build': 'amber',
    'KB Build': 'amber',
    Testing: 'blue',
    Live: 'green',
    Complete: 'green',
  }
  return map[stage] || 'default'
}

export function deployBadge(status) {
  const map = {
    Deployed: 'green',
    Building: 'blue',
    Pending: 'amber',
    Retired: 'default',
    'Build Failed': 'red',
  }
  return map[status] || 'default'
}

export function ticketBadge(status) {
  const map = {
    Open: 'red',
    'In Progress': 'blue',
    'Waiting on Client': 'amber',
    Resolved: 'green',
    Closed: 'default',
  }
  return map[status] || 'default'
}

export function workBadge(status) {
  const map = {
    Backlog: 'default',
    'In Progress': 'blue',
    Review: 'purple',
    Done: 'green',
    Blocked: 'red',
  }
  return map[status] || 'default'
}

export function daysAgo(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const now = new Date()
  return Math.floor((now - d) / 86400000)
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const now = new Date()
  return Math.floor((d - now) / 86400000)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatCurrency(n) {
  return '$' + n.toLocaleString()
}
