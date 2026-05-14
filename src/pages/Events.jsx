// src/pages/Events.jsx

import { liveEvents } from '../data/mockData.js'
import { Card, Badge, SectionHeader, formatDate, daysUntil } from '../components/ui.jsx'

function statusBadge(s) {
  const m = { Planning: 'amber', 'Assets Building': 'blue', Live: 'green', Complete: 'default', Archived: 'default' }
  return m[s] || 'default'
}

export default function Events() {
  return (
    <div>
      <SectionHeader
        title="Live Events"
        sub={`${liveEvents.filter(e => e.event_status === 'Live').length} live · ${liveEvents.filter(e => e.event_status === 'Planning' || e.event_status === 'Assets Building').length} in preparation`}
      />

      <div className="grid grid-cols-2 gap-4">
        {liveEvents.map(e => {
          const days = daysUntil(e.event_date)
          return (
            <Card key={e.id} className={e.event_status === 'Live' ? 'border-c-green/30' : ''}>
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <div className="font-syne font-bold text-[14px] leading-tight">{e.event_name}</div>
                  <div className="font-mono text-[10px] text-muted mt-0.5">{e.client}</div>
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  <Badge>{e.event_type}</Badge>
                  <Badge variant={statusBadge(e.event_status)}>{e.event_status}</Badge>
                </div>
              </div>

              {/* Date countdown */}
              <div className={`mb-3 px-3 py-2.5 rounded-lg border ${
                e.event_status === 'Live' ? 'bg-c-green/5 border-c-green/20' :
                days !== null && days < 7 ? 'bg-c-red/5 border-c-red/20' :
                days !== null && days < 14 ? 'bg-accent/5 border-accent/20' :
                'bg-surface2 border-border'
              }`}>
                <div className="font-mono text-[10px] text-muted">Event Date</div>
                <div className="font-syne font-bold text-[15px] mt-0.5">
                  {formatDate(e.event_date)}
                  {days !== null && e.event_status !== 'Live' && (
                    <span className={`font-mono text-[11px] ml-2 ${days < 7 ? 'text-c-red' : days < 14 ? 'text-accent' : 'text-muted'}`}>
                      {days >= 0 ? `${days}d away` : `${Math.abs(days)}d ago`}
                    </span>
                  )}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                <div>
                  <div className="font-mono text-[10px] text-muted">Builder</div>
                  <div>{e.assigned_builder.split(' ')[0]}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-muted">Registrants</div>
                  <div className="font-mono">{e.registrant_count.toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-muted">Email Sequence</div>
                  <div className="font-mono text-[10px]">{e.email_sequence_id ? '✓ Live' : <span className="text-muted">Not set</span>}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-muted">SMS Sequence</div>
                  <div className="font-mono text-[10px]">{e.sms_sequence_id ? '✓ Live' : <span className="text-muted">Not set</span>}</div>
                </div>
                {e.landing_page_url && (
                  <div className="col-span-2">
                    <div className="font-mono text-[10px] text-muted">Landing Page</div>
                    <a href={e.landing_page_url} target="_blank" rel="noreferrer"
                      className="font-mono text-[10px] text-c-blue hover:underline truncate block">
                      {e.landing_page_url}
                    </a>
                  </div>
                )}
              </div>

              {/* Asset checklist */}
              <div className="mt-3 pt-3 border-t border-border">
                <div className="font-mono text-[10px] text-muted mb-2">ASSET STATUS</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Landing Page', done: !!e.landing_page_url },
                    { label: 'Email Seq', done: !!e.email_sequence_id },
                    { label: 'SMS Seq', done: !!e.sms_sequence_id },
                    { label: 'Registrants', done: e.registrant_count > 0 },
                  ].map(({ label, done }) => (
                    <span key={label} className={`font-mono text-[10px] px-2 py-0.5 rounded border ${done ? 'text-c-green border-c-green/30 bg-c-green/5' : 'text-muted border-border bg-surface2'}`}>
                      {done ? '✓' : '○'} {label}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
