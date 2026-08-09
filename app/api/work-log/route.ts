import { workLogs as dummy } from "@/lib/dummyData";
import { getPool } from "@/lib/db";
import { embed, chunkText, toVectorLiteral } from "@/lib/embeddings";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null);
  if (!body?.summary || !body?.author) return Response.json({ ok:false, error:"author and summary required" }, { status: 400 });
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  const tags = (body.tags || "").split(",").map((s:string)=>s.trim()).filter(Boolean);
  const project = body.project || "TIEVORA Core";

  if (dummyMode) {
    const id = "W" + (dummy.length + 1);
    const entry = { id, author: body.author, project, date: new Date().toISOString().slice(0,10), summary: body.summary, tags };
    dummy.unshift(entry as any);
    return Response.json({ ok:true, entry, mode:"dummy", message:"Indexed (dummy) — RAG will answer from this log within seconds." });
  }

  const pool = getPool();
  if (!pool) return Response.json({ ok:false, error:"DATABASE_URL required for live mode" }, { status:500 });
  try {
    const ins = await pool.query(`INSERT INTO work_logs (author,project,summary,tags) VALUES ($1,$2,$3,$4) RETURNING id, created_at`, [body.author, project, body.summary, tags]);
    const wlId = ins.rows[0].id;
    const chunks = chunkText(body.summary + " " + tags.join(" ") + " " + project, 80);
    for (let i=0;i<chunks.length;i++) {
      const vec = await embed(chunks[i]);
      await pool.query(`INSERT INTO work_log_chunks (work_log_id, chunk_index, chunk_text, embedding) VALUES ($1,$2,$3,$4::vector)`, [wlId, i, chunks[i], toVectorLiteral(vec)]);
    }
    return Response.json({ ok:true, id: wlId, chunks: chunks.length, mode:"live", message:"Indexed + embedded to pgvector — RAG ready in <1s" });
  } catch (e:any) { return Response.json({ ok:false, error:e.message }, { status:500 }); }
}

export async function GET() {
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (dummyMode) return Response.json({ workLogs: dummy, mode:"dummy" });
  const pool = getPool();
  if (!pool) return Response.json({ workLogs: dummy, mode:"dummy-fallback" });
  try {
    const { rows } = await pool.query(`SELECT id::text as id, author, project, summary, tags, to_char(created_at,'YYYY-MM-DD') as date FROM work_logs ORDER BY created_at DESC LIMIT 100`);
    return Response.json({ workLogs: rows, mode:"live" });
  } catch (e:any) { return Response.json({ workLogs: dummy, mode:"dummy-fallback", error:e.message }); }
}
