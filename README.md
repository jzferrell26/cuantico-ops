# Cuantico OPS

Internal operations dashboard for Cuantico Inc. — a single pane of glass for tracking all 60+ client deployments, onboarding stages, bot builds, support tickets, live events, and pending work.

## What it shows

Six pages, each backed by mock data today and a GoHighLevel custom object tomorrow:

- **Overview** — summary stats and charts
- **Onboarding** — kanban + table of clients moving through Kickoff → GHL Setup → Bot Build → KB Build → Testing → Live → Complete
- **Deployments** — bot deployment cards with Assistable bot IDs and GHL workflow links
- **Tickets** — support ticket queue
- **Pending Work** — kanban replacement for Monday.com
- **Events** — live events tracker

## Run it locally

```bash
npm install
npm run dev    # http://localhost:5173
```

Other commands: `npm run build`, `npm run preview`.

## Stack

React 18 + Vite, React Router v6, Tailwind CSS, Recharts, lucide-react.

## Integrations (planned)

All data currently lives in `src/data/mockData.js`. Each array maps 1:1 to an external object:

- **GoHighLevel** — custom objects under `custom_objects.client_onboarding`, `.bot_deployment`, `.support_ticket`, `.pending_work`, `.live_event`. Authenticated via a GHL Private Integration Token (PIT).
- **Assistable AI** (`api.assistable.ai/v2/`) — used to create, list, update, and archive bots that get deployed to clients.

Tokens never live in this frontend — calls will be proxied through a Supabase Edge Function so secrets stay server-side.

See `CLAUDE.md` for the full project conventions and roadmap.
