-- TIEVORA Production Schema — Postgres + pgvector
-- Run: psql $DATABASE_URL -f db/schema.sql  OR npm run db:migrate

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Offices: 50+ Tietoevry locations (source tieto.com/locations)
CREATE TABLE IF NOT EXISTS offices (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  headcount INT NOT NULL DEFAULT 0,
  projects INT NOT NULL DEFAULT 0,
  pulse TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL CHECK (unit IN ('Create','Connect','Care','Banking','Industry','Transform')),
  source TEXT NOT NULL DEFAULT 'tieto.com/locations',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_offices_country ON offices(country);
CREATE INDEX IF NOT EXISTS idx_offices_unit ON offices(unit);

-- Projects: P&L, deadlines, progress
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  region TEXT NOT NULL,
  office TEXT NOT NULL REFERENCES offices(id) ON DELETE SET NULL,
  office_city TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('On Track','At Risk','Delayed','Completed')),
  progress INT NOT NULL CHECK (progress >=0 AND progress <=100),
  deadline DATE NOT NULL,
  budget INT NOT NULL,
  spent INT NOT NULL,
  profit INT NOT NULL,
  team INT NOT NULL,
  risk TEXT NOT NULL DEFAULT 'Low',
  unit TEXT NOT NULL CHECK (unit IN ('Create','Connect','Care','Banking','Industry','Transform')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_unit ON projects(unit);

-- Resources / HR
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  office TEXT NOT NULL,
  office_id TEXT REFERENCES offices(id) ON DELETE SET NULL,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  utilization INT NOT NULL CHECK (utilization >=0 AND utilization <=100),
  leaving_risk TEXT NOT NULL CHECK (leaving_risk IN ('Low','Medium','High')),
  backup TEXT,
  skills JSONB NOT NULL DEFAULT '[]',
  last_log TEXT NOT NULL DEFAULT '',
  last_log_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_resources_country ON resources(country);
CREATE INDEX IF NOT EXISTS idx_resources_risk ON resources(leaving_risk);

-- Users & RBAC (CEO vs Manager)
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('CEO','Manager')),
  country TEXT,
  office_id TEXT REFERENCES offices(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work logs — mandatory daily updates, RAG source
CREATE TABLE IF NOT EXISTS work_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author TEXT NOT NULL,
  author_id TEXT REFERENCES resources(id),
  project TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id),
  summary TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_work_logs_author ON work_logs(author);
CREATE INDEX IF NOT EXISTS idx_work_logs_created ON work_logs(created_at DESC);

-- Work log chunks + embeddings (RAG) — 512 token chunks, 1536 dim for OpenAI ada002
CREATE TABLE IF NOT EXISTS work_log_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_log_id UUID NOT NULL REFERENCES work_logs(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chunks_work_log ON work_log_chunks(work_log_id);
-- IVFFlat for vector search (needs >100 rows to be useful; dummy data bypasses)
-- CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON work_log_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);

-- Nudges audit
CREATE TABLE IF NOT EXISTS nudges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id TEXT NOT NULL REFERENCES resources(id),
  channel TEXT NOT NULL CHECK (channel IN ('slack','email')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'sent'
);

-- Seed verification view
CREATE OR REPLACE VIEW v_ceo_pulse AS
SELECT o.country, o.unit, count(*) as offices, sum(o.headcount) as headcount, sum(o.projects) as projects
FROM offices o GROUP BY o.country, o.unit;
