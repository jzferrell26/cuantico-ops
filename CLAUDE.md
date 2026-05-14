# Cuantico OPS Dashboard

Internal operations dashboard for Cuantico Inc. — tracks all 60+ client deployments, onboarding stages, bot builds, support tickets, live events, and pending work.

## Stack
- **React 18** + **Vite** — frontend framework
- **React Router v6** — client-side routing
- **Tailwind CSS** — styling (custom Cuantico color system in tailwind.config.js)
- **Recharts** — charts on the Overview page
- **Lucide React** — icons if needed

## Dev Commands
```bash
npm run dev      # start dev server on http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

## Project Structure
```
src/
  data/
    mockData.js       ← ALL mock data lives here. Real GHL API calls replace these later.
  components/
    ui.jsx            ← Shared primitives: Badge, Card, StatCard, SectionHeader, helpers
    Sidebar.jsx       ← Left nav
  pages/
    Overview.jsx      ← Dashboard home with stats + charts
    Onboarding.jsx    ← Client onboarding kanban + table
    Deployments.jsx   ← Bot deployment cards
    Tickets.jsx       ← Support ticket queue
    PendingWork.jsx   ← Pending work kanban (Monday replacement)
    Events.jsx        ← Live events tracker
  App.jsx             ← Routes
  main.jsx            ← Entry
  index.css           ← Tailwind base
```

## Color System (Tailwind classes)
```
bg-bg         #0a0a0b    — page background
bg-surface    #111114    — card background
bg-surface2   #18181d    — nested surfaces
border-border #222228    — all borders
text-accent   #f0a500    — Cuantico gold (primary accent)
text-accent2  #e05c2a    — orange
text-c-green  #2dca73    — success / live / deployed
text-c-blue   #4a9eff    — info / in-progress
text-c-purple #9b6dff    — pending / testing
text-c-red    #ff4a6e    — errors / critical
text-muted    #5a5a6a    — secondary text
```

## Typography
- **font-syne** — headings, labels, numbers (Syne from Google Fonts)
- **font-mono** — IBM Plex Mono — all codes, IDs, timestamps, tags
- **font-sans** — DM Sans — body text (default)

## Key Conventions

### Badge variants
`default | green | blue | amber | orange | purple | red`

### Adding a new page
1. Create `src/pages/NewPage.jsx`
2. Add route in `App.jsx`
3. Add nav entry in `Sidebar.jsx`

### Adding new mock data
Edit `src/data/mockData.js`. Each object type has its own exported array. `getStats()` is a computed function that derives summary numbers — update it if you add new fields.

### Switching to real GHL API
Each mock data array in `mockData.js` maps directly to a GHL Custom Object:
```
onboardingRecords  → GET /v2/custom-objects/custom_objects.client_onboarding/records
botDeployments     → GET /v2/custom-objects/custom_objects.bot_deployment/records
supportTickets     → GET /v2/custom-objects/custom_objects.support_ticket/records
pendingWork        → GET /v2/custom-objects/custom_objects.pending_work/records
liveEvents         → GET /v2/custom-objects/custom_objects.live_event/records
```
Auth: `Authorization: Bearer {GHL_PIT_TOKEN}` header on all requests.
Route calls through a Supabase Edge Function to avoid exposing the token in frontend.

## GHL Custom Object Keys (after you build them in GHL)
```
custom_objects.client_onboarding
custom_objects.bot_deployment
custom_objects.support_ticket
custom_objects.pending_work
custom_objects.live_event
```

## Assistable API (for bot automation)
Base URL: `https://api.assistable.ai/v2/`
Auth: `Authorization: Bearer {ASSISTABLE_API_KEY}`

Endpoints:
- `POST /create-assistant` — create bot (name, description, location_id, prompt, model, voice_id, knowledge_id)
- `GET  /get-assistant` — list/get assistants
- `PUT  /update-assistant` — update bot (assistant_id + any fields)
- `DEL  /archive-assistant` — retire a bot

## Deployment
Currently runs locally. Future: deploy to Lovable or Vercel.
GHL PIT token and Assistable API key should never be in frontend code — always proxy through Supabase Edge Functions.

## Current Status (May 2026)
- ✅ Mock data wired for all 5 object types
- ✅ All 6 pages functional
- ✅ Kanban views for Onboarding and Pending Work
- ✅ Filtering on all list views
- ⬜ Real GHL API integration
- ⬜ Supabase auth layer
- ⬜ Write operations (ticket resolve, stage updates, etc.)
- ⬜ Assistable bot automation trigger
- ⬜ AI agent integration
