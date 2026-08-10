import { resources as dummy } from "@/lib/dummyData";
import { getPool } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page")||"1",10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit")||"20",10)));
  const q = searchParams.get("q")?.toLowerCase() || "";
  const country = searchParams.get("country");
  const mandatory = searchParams.get("mandatory"); // "true" => only Knowledge Owners (<200)
  const offset = (page-1)*limit;

  // Dummy mode — paginated, filtered
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  let filtered: any[] = dummy as any;
  if (q) filtered = filtered.filter((r:any)=> `${r.name} ${r.role} ${r.office} ${r.skills.join(" ")}`.toLowerCase().includes(q));
  if (country) filtered = filtered.filter((r:any)=> r.country===country);
  if (mandatory==="true") filtered = filtered.filter((r:any)=> r.isKnowledgeOwner);
  const total = filtered.length;
  const paged = filtered.slice(offset, offset+limit);

  if (dummyMode) {
    return Response.json({
      resources: paged,
      total,
      page, limit,
      totalPages: Math.ceil(total/limit),
      mandatoryCount: (dummy as any).filter((r:any)=> r.isKnowledgeOwner).length,
      autoCount: (dummy as any).filter((r:any)=> !r.isKnowledgeOwner).length,
      mode:"dummy",
      note: "Hybrid <200: mandatory only for Knowledge Owners (CEO/Country Heads/Leads), rest auto-captured from Git/Jira/PRs"
    });
  }

  const pool = getPool();
  if (!pool) return Response.json({ resources: paged, total, page, limit, mode:"dummy-fallback" });

  try {
    const clauses: string[] = [];
    const vals: any[] = [];
    if (q) { vals.push(`%${q}%`); clauses.push(`(LOWER(name) LIKE LOWER($${vals.length}) OR LOWER(role) LIKE LOWER($${vals.length}) OR LOWER(office) LIKE LOWER($${vals.length}))`); }
    if (country) { vals.push(country); clauses.push(`country = $${vals.length}`); }
    if (mandatory==="true") clauses.push(`is_knowledge_owner = TRUE`);
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const countRes = await pool.query(`SELECT COUNT(*) FROM resources ${where}`, vals);
    const totalLive = Number(countRes.rows[0].count);
    const dataRes = await pool.query(`SELECT id,name,role,office,country,state,utilization,leaving_risk as "leavingRisk",backup,skills,last_log as "lastLog", is_knowledge_owner as "isKnowledgeOwner", log_source as "logSource" FROM resources ${where} ORDER BY is_knowledge_owner DESC, leaving_risk DESC, utilization DESC LIMIT $${vals.length+1} OFFSET $${vals.length+2}`, [...vals, limit, offset]);
    const resources = dataRes.rows.map(r=> ({ ...r, skills: typeof r.skills==="string" ? JSON.parse(r.skills) : r.skills }));
    return Response.json({ resources, total: totalLive, page, limit, totalPages: Math.ceil(totalLive/limit), mode:"live" });
  } catch (e:any) { return Response.json({ resources: paged, total, page, limit, mode:"dummy-fallback", error:e.message }); }
}
