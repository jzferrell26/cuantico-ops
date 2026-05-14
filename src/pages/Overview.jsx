// src/pages/Overview.jsx

import { getStats, botDeployments, supportTickets, pendingWork, onboardingRecords } from '../data/mockData.js'
import { StatCard, Card, Badge, SectionHeader, StatusDot, priorityBadge, deployBadge, stageBadge, formatCurrency, daysUntil, formatDate } from '../components/ui.jsx'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const STAGE_ORDER = ['Kickoff', 'GHL Setup', 'Bot Build', 'KB Build', 'Testing', 'Live', 'Complete']

function stageData() {
  return STAGE_ORDER.map(stage => ({
    stage: stage.replace(' ', '\n'),
    count: onboardingRecords.filter(r => r.onboarding_stage === stage).length,
  }))
}

export default function Overview() {
  const stats = getStats()
  const critical = supportTickets.filter(t => t.priority === 'Critical' && t.ticket_status !== 'Resolved')
  const blocked = pendingWork.filter(w => w.work_status === 'Blocked')
  const recentDeploys = botDeployments.filter(d => d.deployment_status === 'Deployed').slice(0, 4)

  return (
    <div>
      <SectionHeader
        title="Operations Overview"
        sub="Live status across all Cuantico client deployments, builds, and support queue."
      />

      {/* STATS */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <StatCard label="Active Deployments" value={stats.activeDeployments} variant="green" />
        <StatCard label="Total MRR" value={formatCurrency(stats.totalMRR)} sub="across all clients" variant="amber" />
        <StatCard label="Open Tickets" value={stats.openTickets} sub={`${stats.criticalTickets} critical`} variant="red" />
        <StatCard label="Items In Progress" value={stats.inProgress} sub={`${stats.blocked} blocked`} variant="blue" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard label="Live Clients" value={stats.liveClients} variant="green" />
        <StatCard label="OAuth Expired" value={stats.oauthExpired} sub="need reconnect" variant="red" />
        <StatCard label="Pending Builds" value={botDeployments.filter(d => d.deployment_status === 'Pending' || d.deployment_status === 'Building').length} variant="amber" />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Pipeline chart */}
        <Card>
          <div className="font-syne font-bold text-[13px] mb-4">Onboarding Pipeline</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stageData()} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="stage" tick={{ fill: '#5a5a6a', fontSize: 9, fontFamily: 'IBM Plex Mono' }} />
              <YAxis tick={{ fill: '#5a5a6a', fontSize: 9 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#18181d', border: '1px solid #222228', borderRadius: 4, fontSize: 11 }}
                itemStyle={{ color: '#e8e8ec' }}
                labelStyle={{ color: '#5a5a6a' }}
              />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {stageData().map((entry, i) => (
                  <Cell key={i} fill={entry.count > 0 ? '#f0a500' : '#222228'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Alerts */}
        <Card>
          <div className="font-syne font-bold text-[13px] mb-4">
            🚨 Active Alerts
            {(critical.length + blocked.length) > 0 && (
              <span className="ml-2 font-mono text-[10px] bg-c-red/10 text-c-red border border-c-red/30 px-1.5 py-0.5 rounded">
                {critical.length + blocked.length}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {critical.map(t => (
              <div key={t.id} className="flex gap-2.5 p-2.5 rounded bg-c-red/5 border border-c-red/15">
                <StatusDot status="Open" />
                <div>
                  <div className="text-[12px]">{t.ticket_title}</div>
                  <div className="text-[11px] text-muted mt-0.5">{t.client}</div>
                </div>
              </div>
            ))}
            {blocked.map(w => (
              <div key={w.id} className="flex gap-2.5 p-2.5 rounded bg-c-red/5 border border-c-red/15">
                <StatusDot status="Blocked" />
                <div>
                  <div className="text-[12px]">{w.work_item}</div>
                  <div className="text-[11px] text-muted mt-0.5">{w.client}</div>
                </div>
              </div>
            ))}
            {critical.length + blocked.length === 0 && (
              <div className="text-muted text-[12px] py-4 text-center">All clear ✓</div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Active deployments */}
        <Card>
          <div className="font-syne font-bold text-[13px] mb-4">Active Deployments</div>
          <div className="space-y-2">
            {recentDeploys.map(d => (
              <div key={d.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <div>
                  <div className="text-[12px]">{d.deployment_name}</div>
                  <div className="font-mono text-[10px] text-muted mt-0.5">{d.bot_type} · {d.bot_model.split(' ')[0]}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={d.oauth_status === 'Expired' ? 'red' : 'default'}>{d.oauth_status}</Badge>
                  <Badge variant="green">Live</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming campaign dates */}
        <Card>
          <div className="font-syne font-bold text-[13px] mb-4">Upcoming Campaign Dates</div>
          <div className="space-y-2">
            {onboardingRecords
              .filter(r => r.campaign_start_date && daysUntil(r.campaign_start_date) !== null)
              .sort((a, b) => new Date(a.campaign_start_date) - new Date(b.campaign_start_date))
              .slice(0, 6)
              .map(r => {
                const days = daysUntil(r.campaign_start_date)
                return (
                  <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <div>
                      <div className="text-[12px]">{r.client_name}</div>
                      <div className="font-mono text-[10px] text-muted mt-0.5">{formatDate(r.campaign_start_date)}</div>
                    </div>
                    <Badge variant={days < 0 ? 'green' : days < 7 ? 'red' : days < 14 ? 'amber' : 'default'}>
                      {days < 0 ? 'Live' : `${days}d`}
                    </Badge>
                  </div>
                )
              })}
          </div>
        </Card>
      </div>
    </div>
  )
}
