// src/components/Sidebar.jsx

import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

const NAV = [
  { path: '/', label: 'Overview', icon: '▦' },
  { path: '/onboarding', label: 'Onboarding', icon: '⟳' },
  { path: '/deployments', label: 'Bot Deployments', icon: '◈' },
  { path: '/tickets', label: 'Support Tickets', icon: '◎' },
  { path: '/pending', label: 'Pending Work', icon: '◫' },
  { path: '/events', label: 'Live Events', icon: '◆' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 bg-surface border-r border-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="font-syne font-extrabold text-[17px] tracking-tight">
          Cuantico<span className="text-accent">.</span>OPS
        </div>
        <div className="font-mono text-[10px] text-muted mt-0.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-c-green animate-pulse mr-1.5 mb-px" />
          Live — Mock Data
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        <div className="text-[10px] font-mono text-muted uppercase tracking-widest px-2 mb-2">Workspace</div>
        {NAV.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded text-[13px] mb-0.5 transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-muted hover:text-white hover:bg-surface2'
              )
            }
          >
            <span className="text-[11px] opacity-70">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <div className="font-mono text-[10px] text-muted">v1.0.0-mock</div>
        <div className="font-mono text-[10px] text-muted mt-0.5">GHL API: not wired</div>
      </div>
    </aside>
  )
}
