// src/pages/Onboarding.jsx

import { useState } from 'react'
import { onboardingRecords } from '../data/mockData.js'
import { Card, Badge, SectionHeader, StatusDot, stageBadge, formatDate, formatCurrency, daysUntil } from '../components/ui.jsx'

const STAGES = ['Kickoff', 'GHL Setup', 'Bot Build', 'KB Build', 'Testing', 'Live', 'Complete']

function ClientCard({ r }) {
  const days = daysUntil(r.campaign_start_date)
  const isOverdue = days !== null && days < 0 && r.onboarding_stage !== 'Live' && r.onboarding_stage !== 'Complete'

  return (
    <div className={`bg-surface2 border rounded-lg p-3.5 mb-2 ${isOverdue ? 'border-c-red/30' : 'border-border'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-[12px] font-medium leading-tight">{r.client_name}</div>
        <Badge variant={stageBadge(r.onboarding_stage)}>{r.onboarding_stage}</Badge>
      </div>
      <div className="space-y-1">
        {r.current_bot_step !== 'None' && (
          <div className="font-mono text-[10px] text-c-blue">Next: {r.current_bot_step}</div>
        )}
        <div className="font-mono text-[10px] text-muted">
          Builder: {r.assigned_builder.split(' ')[0]}
        </div>
        <div className="font-mono text-[10px] text-muted">
          MRR: {formatCurrency(r.contract_value)}
        </div>
        {r.campaign_start_date && (
          <div className={`font-mono text-[10px] ${days < 7 && days >= 0 ? 'text-accent' : days < 0 ? 'text-c-green' : 'text-muted'}`}>
            Campaign: {formatDate(r.campaign_start_date)}
            {days !== null && days >= 0 && ` (${days}d)`}
            {days !== null && days < 0 && ' ✓ Live'}
          </div>
        )}
        {r.days_since_kickoff > 30 && r.onboarding_stage !== 'Live' && r.onboarding_stage !== 'Complete' && (
          <div className="text-c-red text-[10px] font-mono">⚠ {r.days_since_kickoff}d since kickoff</div>
        )}
      </div>
    </div>
  )
}

export default function Onboarding() {
  const [filterBuilder, setFilterBuilder] = useState('All')
  const builders = ['All', ...new Set(onboardingRecords.map(r => r.assigned_builder.split(' ')[0]))]

  const filtered = filterBuilder === 'All'
    ? onboardingRecords
    : onboardingRecords.filter(r => r.assigned_builder.startsWith(filterBuilder))

  const totalMRR = onboardingRecords.reduce((s, r) => s + r.contract_value, 0)

  return (
    <div>
      <SectionHeader
        title="Client Onboarding"
        sub={`${onboardingRecords.length} clients · ${formatCurrency(totalMRR)} total MRR`}
        action={
          <div className="flex gap-1">
            {builders.map(b => (
              <button
                key={b}
                onClick={() => setFilterBuilder(b)}
                className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-colors ${
                  filterBuilder === b
                    ? 'bg-accent/10 border-accent/30 text-accent'
                    : 'bg-transparent border-border text-muted hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        }
      />

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
        {STAGES.map(stage => {
          const cards = filtered.filter(r => r.onboarding_stage === stage)
          return (
            <div key={stage} className="flex-shrink-0 w-52">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="font-mono text-[11px] text-muted uppercase tracking-wide">{stage}</div>
                {cards.length > 0 && (
                  <span className="font-mono text-[10px] bg-surface2 border border-border text-muted px-1.5 py-0.5 rounded">
                    {cards.length}
                  </span>
                )}
              </div>
              <div className={`min-h-24 rounded-lg border border-dashed p-2 ${cards.length === 0 ? 'border-border/40' : 'border-border'}`}>
                {cards.map(r => <ClientCard key={r.id} r={r} />)}
                {cards.length === 0 && (
                  <div className="text-muted text-[11px] text-center py-6">—</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <Card className="mt-5 overflow-x-auto">
        <div className="font-syne font-bold text-[13px] mb-4">All Clients</div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left border-b border-border">
              {['Client', 'Stage', 'Next Bot', 'Builder', 'MRR', 'Campaign', 'Days In'].map(h => (
                <th key={h} className="font-mono text-[10px] text-muted uppercase pb-2 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-surface2 transition-colors">
                <td className="py-2.5 pr-4 font-medium">{r.client_name}</td>
                <td className="py-2.5 pr-4"><Badge variant={stageBadge(r.onboarding_stage)}>{r.onboarding_stage}</Badge></td>
                <td className="py-2.5 pr-4 font-mono text-[11px] text-muted">{r.current_bot_step}</td>
                <td className="py-2.5 pr-4 text-muted">{r.assigned_builder.split(' ')[0]}</td>
                <td className="py-2.5 pr-4 font-mono">{formatCurrency(r.contract_value)}</td>
                <td className="py-2.5 pr-4 font-mono text-[11px] text-muted">{formatDate(r.campaign_start_date)}</td>
                <td className="py-2.5 font-mono text-[11px]">
                  <span className={r.days_since_kickoff > 30 ? 'text-c-red' : 'text-muted'}>
                    {r.days_since_kickoff}d
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
