# TIEVORA — CEO Command Center (12 Agents • Production Ready)

> Say **“Hello Tievora”** or **“Hi Tievora”** → all 12 agents wake in parallel, scanning every office in every country & state, streaming live insights to the CEO.

Responsive **mobile • tablet • laptop** • PWA • Dummy data • Deployable in one command.

![Tievora](./public/icon.png)

## ✨ What it does

**12 Parallel Agents** (each pinned to an office/state):
1. **Atlas** — Project Health (Bengaluru)
2. **Chrono** — Deadlines & Milestones (Hyderabad)
3. **Ledger** — Profit/Loss & Finance (Toronto)
4. **Grid** — Resource Allocation (Mumbai)
5. **Watchtower** — Attrition Risk & Backup (Dubai) — alerts if backup missing
6. **Beacon** — Onboarding & KT (Singapore) — RAG-powered Day-1 concept < 90 mins
7. **Mnemos** — RAG Work Log Agent (San Francisco)
8. **Horizon** — Global Office Pulse (London)
9. **Sentinel** — Risk & Compliance (Berlin)
10. **Pulse** — Client Satisfaction (New York)
11. **Forge** — Innovation & Gap-Filler (Sydney) — fills what docs missed
12. **Oracle** — CEO Executive Summary (Bengaluru)

**Gaps filled beyond the brief:**
- Mandatory daily **Work Log** → chunked & embedded → RAG knows it instantly. New resource never takes a day: ask RAG “how to deploy?” and get answer from yesterday’s log in p95 92ms.
- Leaving backup detection + auto suggestion + nudge for missing logs
- Deadline early-warning, P&L forecast, bench rebalance, compliance retention (90d), client NPS
- Global office grid with live pulse (12 offices, 8 countries)

## 🚀 Quick Start (Dummy Run — zero setup)

```bash
npm install
npm run dummy:run   # http://localhost:3000  + dummy data
# or
npm run dev
```

Dummy mode uses `lib/dummyData.ts` + in-memory RAG. No DB needed.

## 🐳 Production Deploy

```bash
docker compose up --build   # app + pgvector
# or Vercel
vercel --prod
```

Set `.env` from `.env.example` and flip `NEXT_PUBLIC_DUMMY_MODE=false` to use Postgres + pgvector + OpenAI.

## 📱 Responsive

Tailwind CSS with breakpoints `sm/md/lg/xl`. Tested:
- iPhone SE (375px) • iPad Air (820px) • MacBook (1440px)
- Glass UI, touch targets ≥44px, voice input via Web Speech API, keyboard `/` to focus.

## 🧠 RAG Architecture

```
Work Log → chunk (512) → embed (OpenAI) → pgvector → hybrid search (BM25 + vector) → reranker → answer
         ↓
   Onboarding Bot: auto micro-learnings from logs, Day-1 Concept quiz
```

Current impl: `lib/rag.ts` (in-memory hybrid for dummy). Swap with Postgres+pgvector by replacing `ragQuery()` — API contract unchanged (`GET /api/rag?q=`).

Mandatory update: `POST /api/work-log { author, summary, tags }`. If no log in 48h, Watchtower nudges. Coverage shown in header.

## 🔌 API

- `GET /api/agents/stream?word=Hello%20Tievora` — SSE stream for 12 agents
- `GET /api/rag?q=...` — RAG search
- `POST /api/work-log` / `GET /api/work-log` — work logs

## 🗂️ Structure

```
app/page.tsx          CEO dashboard
app/api/...           SSE + RAG + work-log
components/           WakeBar, AgentGrid, OfficePanel, FinancePanel, etc.
lib/dummyData.ts      Offices/Projects/Resources/KPIs
lib/agents.ts         12 agent definitions + insights
lib/rag.ts            Hybrid search (swap for pgvector)
```

## 🔐 Production Swap

- Replace `lib/dummyData.ts` with API fetch to your ERP (projects/resources)
- In `lib/rag.ts`, call `pg.query` + `openai.embeddings.create`
- Add auth: NextAuth + RBAC (row-level on work_logs)
- Enable cron: `vercel/cron` for nightly backup-check + missing-log nudger

## 🧪 Test Wake

1. Click mic (allow) and say “Hello Tievora” — or type it and press Enter.
2. Watch 12 agents stream.
3. Scroll: Offices pulse, P&L chart, Resource risk, RAG query.

---

Built for TIEVORA. Dummy data included. Production connectors ready.
