// src/pages/Deployments.jsx

import { useState } from 'react'
import { botDeployments } from '../data/mockData.js'
import { Card, Badge, SectionHeader, deployBadge, formatDate } from '../components/ui.jsx'

const STATUSES = ['All', 'Deployed', 'Building', 'Pending', 'Retired']
const TYPES = ['All', 'Voice Bot', 'SMS Bot', 'Chat Widget']

export default function Deployments() {
  const [status, setStatus] = useState('All')
  const [type, setType] = useState('All')

  const filtered = botDeployments.filter(d =>
    (status === 'All' || d.deployment_status === status) &&
    (type === 'All' || d.bot_type === type)
  )

  return (
    <div>
      <SectionHeader
        title="Bot Deployments"
        sub={`${botDeployments.filter(d => d.deployment_status === 'Deployed').length} active · ${botDeployments.length} total`}
      />

      {/* Summary row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {['Deployed', 'Building', 'Pending', 'Retired', 'OAuth Expired'].map(s => {
          const count = s === 'OAuth Expired'
            ? botDeployments.filter(d => d.oauth_status === 'Expired' && d.deployment_status === 'Deployed').length
            : botDeployments.filter(d => d.deployment_status === s).length
          const v = s === 'Deployed' ? 'green' : s === 'Building' ? 'blue' : s === 'Pending' ? 'amber' : s === 'OAuth Expired' ? 'red' : 'default'
          return (
            <Card key={s} className="text-center py-3">
              <div className={`font-syne font-extrabold text-2xl tracking-tight ${v === 'green' ? 'text-c-green' : v === 'blue' ? 'text-c-blue' : v === 'amber' ? 'text-accent' : v === 'red' ? 'text-c-red' : 'text-muted'}`}>
                {count}
              </div>
              <div className="font-mono text-[10px] text-muted mt-1">{s}</div>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="flex gap-1">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-colors ${status === s ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border text-muted hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-colors ${type === t ? 'bg-c-blue/10 border-c-blue/30 text-c-blue' : 'border-border text-muted hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(d => (
          <Card key={d.id} className={d.deployment_status === 'Retired' ? 'opacity-50' : ''}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-syne font-bold text-[14px]">{d.deployment_name}</div>
                <div className="font-mono text-[10px] text-muted mt-0.5">{d.bot_type}</div>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                <Badge variant={deployBadge(d.deployment_status)}>{d.deployment_status}</Badge>
                {d.oauth_status === 'Expired' && <Badge variant="red">OAuth Expired</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
              <div>
                <span className="font-mono text-[10px] text-muted block">Model</span>
                <span>{d.bot_model}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-muted block">Campaign</span>
                <span className="truncate block">{d.campaign_name || '—'}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-muted block">Bot ID</span>
                <span className="font-mono text-[10px]">{d.assistable_bot_id ? `${d.assistable_bot_id.slice(0, 12)}…` : <span className="text-muted">Not created</span>}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-muted block">Deployed</span>
                <span>{formatDate(d.deployed_date)}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-muted block">Knowledge Base</span>
                <span className="font-mono text-[10px]">{d.knowledge_base_id ? '✓ Attached' : <span className="text-muted">None</span>}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-muted block">GHL Workflow</span>
                <span className="font-mono text-[10px]">{d.ghl_workflow_id ? '✓ Linked' : <span className="text-muted">None</span>}</span>
              </div>
            </div>

            {/* OAuth alert */}
            {d.oauth_status === 'Expired' && d.deployment_status === 'Deployed' && (
              <div className="mt-3 px-3 py-2 bg-c-red/5 border border-c-red/20 rounded text-[11px] text-c-red">
                ⚠ OAuth token expired — bot will fail on next call. Reconnect in Assistable.
              </div>
            )}

            {/* Pending warning */}
            {d.deployment_status === 'Pending' && (
              <div className="mt-3 px-3 py-2 bg-accent/5 border border-accent/20 rounded text-[11px] text-accent">
                Awaiting deployment automation trigger
              </div>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12 text-muted">No deployments match the current filters.</Card>
      )}
    </div>
  )
}
