import { ragQuery } from "@/lib/rag";
import { getPool } from "@/lib/db";
import { embed, toVectorLiteral } from "@/lib/embeddings";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (!q.trim()) return Response.json({ results: [], query: q });
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (dummyMode) {
    const results = ragQuery(q);
    return Response.json({ query: q, results, mode:"dummy", hint:"Dummy hybrid BM25" });
  }
  const pool = getPool();
  if (!pool) {
    const results = ragQuery(q);
    return Response.json({ query: q, results, mode:"dummy-fallback" });
  }
  try {
    const vec = await embed(q);
    const vecLit = toVectorLiteral(vec);
    // hybrid: vector cosine + keyword ILIKE rank
    const { rows } = await pool.query(`
      SELECT wl.id::text, wl.author, wl.project, wl.summary, wl.tags, to_char(wl.created_at,'YYYY-MM-DD') as date,
             c.chunk_text,
             1 - (c.embedding <=> $1::vector) as vector_score
      FROM work_log_chunks c
      JOIN work_logs wl ON wl.id = c.work_log_id
      WHERE c.embedding IS NOT NULL
      ORDER BY c.embedding <=> $1::vector
      LIMIT 8
    `, [vecLit]);
    const results = rows.map(r=> ({
      id: r.id, author: r.author, project: r.project, date: r.date, summary: r.summary, chunk: r.chunk_text, tags: r.tags, score: Number(r.vector_score),
    }));
    // fallback to keyword if vector empty
    if (!results.length) {
      const kw = await pool.query(`SELECT id::text, author, project, summary, tags, to_char(created_at,'YYYY-MM-DD') as date FROM work_logs WHERE summary ILIKE $1 OR array_to_string(tags,' ') ILIKE $1 LIMIT 5`, [`%${q}%`]);
      return Response.json({ query: q, results: kw.rows.map(r=> ({ ...r, score: 0.5 })), mode:"live-keyword-fallback" });
    }
    return Response.json({ query: q, results, mode:"live-vector", hint:"pgvector cosine" });
  } catch (e:any) {
    const results = ragQuery(q);
    return Response.json({ query: q, results, mode:"dummy-fallback-on-error", error: e.message });
  }
}
