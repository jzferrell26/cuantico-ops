// src/pages/Tickets.jsx

import { useState } from 'react'
import { supportTickets } from '../data/mockData.js'
import { Card, Badge, SectionHeader, ticketBadge, priorityBadge, formatDate, daysAgo } from '../components/ui.jsx'

const STATUSES = ['All', 'Open', 'In Progress', 'Waiting on Client', 'Resolved']
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low']

export default function Tickets() {
  const [status, setStatus] = useState('All')
  const [priority, setPriority] = useState('All')

  const filtered = supportTickets.filter(t =>
    (status === 'All' || t.ticket_status === status) &&
    (priority === 'All' || t.priority === priority)
  )

  const open = supportTickets.filter(t => t.ticket_status !== 'Resolved' && t.ticket_status !== 'Closed')

  return (
    <div>
      <SectionHeader
        title="Support Tickets"
        sub={`${open.length} open · ${supportTickets.filter(t => t.priority === 'Critical' && t.ticket_status !== 'Resolved').length} critical`}
      />

      {/* Priority breakdown */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {['Critical', 'High', 'Medium', 'Low'].map(p => {
          const count = supportTickets.filter(t => t.priority === p && t.ticket_status !== 'Resolved').length
          const v = priorityBadge(p)
          const colors = { red: 'text-c-red', orange: 'text-accent2', amber: 'text-accent', default: 'text-muted' }
          return (
            <Card key={p} className="text-center py-3">
              <div className={`font-syne font-extrabold text-2xl tracking-tight ${colors[v]}`}>{count}</div>
              <div className="font-mono text-[10px] text-muted mt-1">{p}</div>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-colors ${status === s ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border text-muted hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {PRIORITIES.map(p => (
            <button key={p} onClick={() => setPriority(p)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-colors ${priority === p ? 'bg-c-red/10 border-c-red/30 text-c-red' : 'border-border text-muted hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket list */}
      <div className="space-y-2">
        {filtered
          .sort((a, b) => {
            const pOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
            return (pOrder[a.priority] || 3) - (pOrder[b.priority] || 3)
          })
          .map(t => {
            const age = daysAgo(t.created_date)
            return (
              <Card key={t.id} className={t.priority === 'Critical' && t.ticket_status !== 'Resolved' ? 'border-c-red/30' : ''}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge variant={priorityBadge(t.priority)}>{t.priority}</Badge>
                      <Badge variant={ticketBadge(t.ticket_status)}>{t.ticket_status}</Badge>
                      <Badge>{t.category}</Badge>
                    </div>
                    <div className="text-[13px] font-medium mb-1">{t.ticket_title}</div>
                    <div className="text-[11px] text-muted">{t.client}</div>
                    {t.resolution_notes && (
                      <div className="mt-2 text-[11px] text-muted bg-surface2 rounded px-3 py-2 border border-border">
                        {t.resolution_notes}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 text-[11px] text-muted space-y-1">
                    <div>{t.assigned_to.split(' ')[0]}</div>
                    <div className="font-mono text-[10px]">{age !== null ? `${age}d ago` : formatDate(t.created_date)}</div>
                    {t.resolved_date && (
                      <div className="font-mono text-[10px] text-c-green">✓ {formatDate(t.resolved_date)}</div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        {filtered.length === 0 && (
          <Card className="text-center py-12 text-muted">No tickets match the current filters.</Card>
        )}
      </div>
    </div>
  )
}
