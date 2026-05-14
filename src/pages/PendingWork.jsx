// src/pages/PendingWork.jsx

import { useState } from 'react'
import { pendingWork } from '../data/mockData.js'
import { Card, Badge, SectionHeader, workBadge, formatDate, daysUntil } from '../components/ui.jsx'

const STATUSES = ['Backlog', 'In Progress', 'Review', 'Done', 'Blocked']
const TYPES = ['All', 'Bot Build', 'GHL Config', 'Email/SMS', 'Landing Page', 'Reporting', 'Other']

export default function PendingWork() {
  const [typeFilter, setTypeFilter] = useState('All')
  const [assigneeFilter, setAssigneeFilter] = useState('All')

  const assignees = ['All', ...new Set(pendingWork.map(w => w.assigned_to.split(' ')[0]))]

  const filtered = pendingWork.filter(w =>
    (typeFilter === 'All' || w.work_type === typeFilter) &&
    (assigneeFilter === 'All' || w.assigned_to.startsWith(assigneeFilter))
  )

  return (
    <div>
      <SectionHeader
        title="Pending Work"
        sub={`${pendingWork.filter(w => w.work_status === 'In Progress').length} in progress · ${pendingWork.filter(w => w.work_status === 'Blocked').length} blocked`}
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {TYPES.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-colors ${typeFilter === t ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border text-muted hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {assignees.map(a => (
            <button key={a} onClick={() => setAssigneeFilter(a)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-colors ${assigneeFilter === a ? 'bg-c-blue/10 border-c-blue/30 text-c-blue' : 'border-border text-muted hover:text-white'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
        {STATUSES.map(stage => {
          const items = filtered.filter(w => w.work_status === stage)
          const borderColor = stage === 'Blocked' ? 'border-c-red/30' : stage === 'In Progress' ? 'border-c-blue/20' : stage === 'Done' ? 'border-c-green/20' : 'border-border'

          return (
            <div key={stage} className="flex-shrink-0 w-56">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="font-mono text-[10px] text-muted uppercase tracking-wide">{stage}</div>
                {items.length > 0 && (
                  <span className="font-mono text-[10px] bg-surface2 border border-border text-muted px-1.5 py-0.5 rounded">
                    {items.length}
                  </span>
                )}
              </div>
              <div className={`min-h-24 rounded-lg border border-dashed ${borderColor} p-2 space-y-2`}>
                {items.map(w => {
                  const days = daysUntil(w.due_date)
                  const overdue = days !== null && days < 0 && w.work_status !== 'Done'
                  return (
                    <div key={w.id} className={`bg-surface2 border rounded-lg p-3 ${w.work_status === 'Blocked' ? 'border-c-red/30' : overdue ? 'border-accent/30' : 'border-border'}`}>
                      <div className="text-[11px] font-medium leading-tight mb-2">{w.work_item}</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge>{w.work_type}</Badge>
                      </div>
                      <div className="font-mono text-[10px] text-muted">{w.assigned_to.split(' ')[0]}</div>
                      {w.due_date && (
                        <div className={`font-mono text-[10px] mt-1 ${overdue ? 'text-c-red' : days < 3 ? 'text-accent' : 'text-muted'}`}>
                          {overdue ? `⚠ ${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
                        </div>
                      )}
                      {w.notes && (
                        <div className="text-[10px] text-muted mt-1.5 leading-tight line-clamp-2">{w.notes}</div>
                      )}
                    </div>
                  )
                })}
                {items.length === 0 && (
                  <div className="text-muted text-[11px] text-center py-6">—</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* List view */}
      <Card className="mt-5 overflow-x-auto">
        <div className="font-syne font-bold text-[13px] mb-4">All Items</div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left border-b border-border">
              {['Item', 'Type', 'Status', 'Assignee', 'Due', 'Est. Hrs', 'Client'].map(h => (
                <th key={h} className="font-mono text-[10px] text-muted uppercase pb-2 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => {
              const days = daysUntil(w.due_date)
              const overdue = days !== null && days < 0 && w.work_status !== 'Done'
              return (
                <tr key={w.id} className="border-b border-border/50 hover:bg-surface2 transition-colors">
                  <td className="py-2.5 pr-4 max-w-xs">
                    <div className={overdue ? 'text-c-red' : ''}>{w.work_item}</div>
                  </td>
                  <td className="py-2.5 pr-4"><Badge>{w.work_type}</Badge></td>
                  <td className="py-2.5 pr-4"><Badge variant={workBadge(w.work_status)}>{w.work_status}</Badge></td>
                  <td className="py-2.5 pr-4 text-muted">{w.assigned_to.split(' ')[0]}</td>
                  <td className="py-2.5 pr-4 font-mono text-[11px]">
                    <span className={overdue ? 'text-c-red' : days !== null && days < 3 ? 'text-accent' : 'text-muted'}>
                      {formatDate(w.due_date)}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-[11px] text-muted">{w.estimated_hours}h</td>
                  <td className="py-2.5 text-muted">{w.client}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
