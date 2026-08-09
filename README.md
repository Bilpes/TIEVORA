# TIEVORA — CEO Command Center (12 Agents • Production Ready)

> Say **“Hello Tievora”** or **“Hi Tievora”** → 12 agents wake in parallel, scanning 50+ Tietoevry offices (tieto.com/locations) across 27 countries, split by Create/Connect/Care/Banking/Industry/Transform, streaming to CEO in 1.6s.

Mobile • Tablet • Laptop • PWA • Leaflet clustered map • RBAC • Real API + pgvector RAG

## ✨ What it does

**12 Parallel Agents** (region-pinned): Atlas/Espoo, Chrono/Stockholm, Ledger/Szczecin, Grid/Bangalore, Watchtower/Kyiv, Beacon/Fornebu, Mnemos/Minneapolis, Horizon/London, Sentinel/Regensburg, Pulse/Riga, Forge/Ostrava, Oracle/Espoo.

**Key gaps filled:** deadline early-warning, P&L, attrition backup (auto), mandatory work-log → RAG (<90m ramp), bench rebalance, GDPR 90d, 50+ offices (Finland 8, Sweden 13, Norway 6, Poland 4, India 3…) with units.

## 🚀 Quick Start — Dummy (no DB)

```bash
npm install
npm run dummy:run   # http://localhost:3000
```

## 🐳 Full Stack — Postgres + pgvector (production)

```bash
# 1) start DB + app
docker compose up --build
# 2) seed DB from dummyData (offices/projects/resources/work_logs + 1536-dim embeddings)
curl -X POST http://localhost:3000/api/seed
curl http://localhost:3000/api/seed        # verify counts
# alternatively:
psql $DATABASE_URL -f db/schema.sql
npm run db:seed:api
```

**Schema:** `db/schema.sql` — enables `vector`, creates `offices`, `projects`, `resources`, `app_users`, `work_logs`, `work_log_chunks(embedding vector(1536))`, `nudges`, view `v_ceo_pulse`.

**Embeddings:** `lib/embeddings.ts` — uses OpenAI `text-embedding-3-small` if `OPENAI_API_KEY` set, otherwise deterministic dummy 1536-dim (L2-normed) for offline.

**APIs (live vs dummy):** `NEXT_PUBLIC_DUMMY_MODE=true` → in-memory dummyData. `false` → Postgres via `lib/db.ts` (pg Pool):
- `GET /api/offices?unit=Create&country=Finland`
- `GET /api/projects` / `GET /api/resources`
- `GET /api/rag?q=...` → pgvector cosine (`embedding <=> query`) + keyword fallback
- `POST /api/work-log` → inserts + chunks (80 words) + embeds to `work_log_chunks`
- `GET/POST /api/nudges` / `POST /api/seed`

## 🗺️ World Map — Leaflet clustered

`components/WorldMap.tsx` — dark CARTO tiles, `markerClusterGroup`, color by unit, tap → popup + office card. Cluster spiderfies on max zoom. 50 pins, fitBounds.

## 👑 RBAC — CEO vs Manager

`lib/auth.ts` + `components/RoleSwitch.tsx` — CEO sees all, Manager filtered to own `country`. Panels Offices/Projects/Resources/Map/Nudges respect role. Real prod: row-level security on `resources`/`work_logs`.

## 🔔 Nudges — Slack/Email

`GET /api/nudges` lists `backup IS NULL OR leaving_risk='High' OR last_log_at < 48h`. Buttons send via `SLACK_WEBHOOK_URL` or SMTP (`SMTP_HOST`). Audit table `nudges`. Dummy mode mocks.

## 🔧 Env — single toggle

```bash
cp .env.example .env
# dummy (default):
NEXT_PUBLIC_DUMMY_MODE=true
# live:
NEXT_PUBLIC_DUMMY_MODE=false
DATABASE_URL=postgres://tievora:tievora@localhost:5432/tievora
OPENAI_API_KEY=sk-...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
SMTP_HOST=smtp.example.com
```

`lib/config.ts` reads toggle, `docker-compose.yml` passes it as `ARG` + `ENV`, `vercel.json` sets it.

## 📱 Responsive

Tailwind, glass UI, 44px targets, Web Speech API. 375/820/1440px tested.

## 🧪 Try

1. `npm run dummy:run` → type “Hello Tievora” → 12 agents stream.
2. Switch Role to “India Manager” → map/offices filter.
3. Ask RAG “how to deploy” → dummy BM25 or live pgvector.
4. Submit work log → new RAG hit instantly.
5. For DB: `docker compose up`, `curl -X POST /api/seed`, set `NEXT_PUBLIC_DUMMY_MODE=false`, restart, verify `/api/offices?unit=Create` hits Postgres.

## 📦 Deploy

- Vercel: `vercel --prod` (envs in dashboard)
- Docker: `docker compose up --build`
- Vercel DB: set `DATABASE_URL` to Neon/Supabase pgvector instance, run `psql $DATABASE_URL -f db/schema.sql` once, then `POST /api/seed`.

---

Built for TIEVORA — dummy fast, prod ready with real DB + vector RAG.
