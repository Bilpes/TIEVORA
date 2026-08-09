import { offices, projects, resources, workLogs } from "@/lib/dummyData";
import { getPool } from "@/lib/db";
import { embed, chunkText, toVectorLiteral } from "@/lib/embeddings";
export const dynamic = "force-dynamic";

// POST /api/seed  -> migrates schema + seeds offices/projects/resources/work_logs + embeddings
// GET  /api/seed  -> status
export async function GET() {
  const pool = getPool();
  if (!pool) return Response.json({ ok:false, mode:"dummy", message:"DATABASE_URL not set — dummy mode" });
  try {
    const o = await pool.query("SELECT count(*) FROM offices");
    const p = await pool.query("SELECT count(*) FROM projects");
    const r = await pool.query("SELECT count(*) FROM resources");
    const w = await pool.query("SELECT count(*) FROM work_logs");
    const c = await pool.query("SELECT count(*) FROM work_log_chunks");
    return Response.json({ ok:true, counts: { offices: Number(o.rows[0].count), projects: Number(p.rows[0].count), resources: Number(r.rows[0].count), work_logs: Number(w.rows[0].count), chunks: Number(c.rows[0].count) } });
  } catch (e:any) { return Response.json({ ok:false, error: e.message }, { status: 500 }); }
}

export async function POST() {
  const pool = getPool();
  if (!pool) return Response.json({ ok:false, error:"DATABASE_URL required" }, { status: 400 });
  try {
    // Apply schema if not exists (idempotent)
    const fs = await import("fs");
    const schema = fs.readFileSync(process.cwd()+"/db/schema.sql","utf8");
    await pool.query(schema);

    // Upsert offices
    for (const o of offices) {
      await pool.query(`INSERT INTO offices (id,city,country,state,address,lat,lng,headcount,projects,pulse,unit,source)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT (id) DO UPDATE SET city=EXCLUDED.city, country=EXCLUDED.country, state=EXCLUDED.state, address=EXCLUDED.address, lat=EXCLUDED.lat, lng=EXCLUDED.lng, headcount=EXCLUDED.headcount, projects=EXCLUDED.projects, pulse=EXCLUDED.pulse, unit=EXCLUDED.unit, updated_at=NOW()`,
        [o.id, o.city, o.country, o.state, o.address, o.lat, o.lng, o.headcount, o.projects, o.pulse, (o as any).unit, (o as any).source]);
    }
    // Upsert projects
    for (const p of projects) {
      const off = offices.find(o=> o.city===p.office || o.city.includes(p.office) || p.office.includes(o.city))?.id || null;
      await pool.query(`INSERT INTO projects (id,name,client,region,office,office_city,status,progress,deadline,budget,spent,profit,team,risk,unit)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, client=EXCLUDED.client, region=EXCLUDED.region, office=EXCLUDED.office, office_city=EXCLUDED.office_city, status=EXCLUDED.status, progress=EXCLUDED.progress, deadline=EXCLUDED.deadline, budget=EXCLUDED.budget, spent=EXCLUDED.spent, profit=EXCLUDED.profit, team=EXCLUDED.team, risk=EXCLUDED.risk, unit=EXCLUDED.unit, updated_at=NOW()`,
        [p.id, p.name, p.client, p.region, off, p.office, p.status, p.progress, p.deadline, p.budget, p.spent, p.profit, p.team, p.risk, (p as any).unit]);
    }
    // Upsert resources
    for (const r of resources) {
      const off = offices.find(o=> o.city===r.office || r.office.includes(o.city) || o.city.includes(r.office))?.id || null;
      await pool.query(`INSERT INTO resources (id,name,role,office,office_id,country,state,utilization,leaving_risk,backup,skills,last_log)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, role=EXCLUDED.role, office=EXCLUDED.office, office_id=EXCLUDED.office_id, country=EXCLUDED.country, state=EXCLUDED.state, utilization=EXCLUDED.utilization, leaving_risk=EXCLUDED.leaving_risk, backup=EXCLUDED.backup, skills=EXCLUDED.skills, last_log=EXCLUDED.last_log, updated_at=NOW()`,
        [r.id, r.name, r.role, r.office, off, r.country, r.state, r.utilization, r.leavingRisk, r.backup, JSON.stringify(r.skills), r.lastLog]);
    }
    // Upsert work_logs + chunks (clear existing for idempotency in demo)
    await pool.query("DELETE FROM work_log_chunks");
    await pool.query("DELETE FROM work_logs");
    for (const w of workLogs) {
      const ins = await pool.query(`INSERT INTO work_logs (author,project,summary,tags) VALUES ($1,$2,$3,$4) RETURNING id`, [w.author, w.project, w.summary, w.tags]);
      const wlId = ins.rows[0].id;
      const chunks = chunkText(w.summary + " " + w.tags.join(" ") + " " + w.project, 80);
      for (let i=0;i<chunks.length;i++) {
        const vec = await embed(chunks[i]);
        await pool.query(`INSERT INTO work_log_chunks (work_log_id, chunk_index, chunk_text, embedding) VALUES ($1,$2,$3,$4::vector)`, [wlId, i, chunks[i], toVectorLiteral(vec)]);
      }
    }

    const counts = await pool.query("SELECT 'offices' as t, count(*) FROM offices UNION ALL SELECT 'projects', count(*) FROM projects UNION ALL SELECT 'resources', count(*) FROM resources UNION ALL SELECT 'work_logs', count(*) FROM work_logs");
    return Response.json({ ok:true, message:"Seeded 50+ offices, projects, resources, work_log chunks with embeddings", counts: counts.rows });
  } catch (e:any) {
    return Response.json({ ok:false, error: e.message, stack: e.stack }, { status: 500 });
  }
}
