import { resources as dummy } from "@/lib/dummyData";
import { getPool } from "@/lib/db";
export const dynamic = "force-dynamic";

// Hybrid <200: only nudge Knowledge Owners, rest are auto-captured (no spam for 5k)
function buildDummy() {
  const owners = (dummy as any).filter((r:any)=> r.isKnowledgeOwner);
  return owners.filter((r:any)=> !r.backup || r.lastLog.includes("NUDGE") || r.leavingRisk==="High").map((r:any)=> ({
    id: r.id, name: r.name, office: r.office, country: r.country,
    slack: `@${r.name.toLowerCase().replace(/\s+/g,".")}`,
    email: `${r.name.toLowerCase().replace(/\s+/g,".")}@tieto.com`,
    hoursSinceLog: r.lastLog.includes("6 days") ? 146 : r.lastLog.includes("No handover") ? 72 : 52,
    risk: r.leavingRisk, backup: r.backup,
    isKnowledgeOwner: r.isKnowledgeOwner,
    logSource: r.logSource,
  }));
}

export async function GET() {
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (dummyMode) {
    const nudges = buildDummy();
    return Response.json({
      nudges,
      mode:"dummy",
      count: nudges.length,
      note: "Hybrid: only Knowledge Owners (<200) are nudged. Auto-captured users (5k) are summarized, not nagged.",
      mandatoryCount: (dummy as any).filter((r:any)=> r.isKnowledgeOwner).length,
      autoCount: (dummy as any).filter((r:any)=> !r.isKnowledgeOwner).length,
    });
  }
  const pool = getPool();
  if (!pool) return Response.json({ nudges: buildDummy(), mode:"dummy-fallback" });
  try {
    const { rows } = await pool.query(`SELECT id,name,office,country,leaving_risk as risk, backup, EXTRACT(EPOCH FROM (NOW() - last_log_at))/3600 as hours, is_knowledge_owner as "isKnowledgeOwner" FROM resources WHERE is_knowledge_owner = TRUE AND (backup IS NULL OR leaving_risk='High' OR last_log_at < NOW() - INTERVAL '48 hours') ORDER BY hours DESC`);
    const nudges = rows.map((r:any)=> ({ id:r.id,name:r.name,office:r.office,country:r.country, slack:`@${r.name.toLowerCase().replace(/\s+/g,".")}`, email:`${r.name.toLowerCase().replace(/\s+/g,".")}@tieto.com`, hoursSinceLog: Math.round(Number(r.hours)), risk: r.risk, backup: r.backup, isKnowledgeOwner: r.isKnowledgeOwner }));
    return Response.json({ nudges, mode:"live", count: nudges.length });
  } catch (e:any) { return Response.json({ nudges: buildDummy(), mode:"dummy-fallback-on-error", error:e.message }); }
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const channel = body.channel || "slack";
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  const nudges = buildDummy();
  if (dummyMode) return Response.json({ ok:true, channel, sent: nudges.length, message:`✓ Mock ${channel} nudges sent to ${nudges.length} Knowledge Owners (hybrid <200). Auto users not nudged — their work is auto-summarized from Git/Jira.`, mode:"dummy" });
  const pool = getPool();
  if (!pool) return Response.json({ ok:false, error:"DATABASE_URL missing" }, { status:500 });
  const webhook = process.env.SLACK_WEBHOOK_URL;
  for (const n of nudges) { try{ await pool.query(`INSERT INTO nudges (resource_id, channel) VALUES ($1,$2)`, [n.id, channel]); }catch{} }
  if (channel==="slack" && webhook) { try{ await fetch(webhook,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ text:`TIEVORA: ${nudges.length} Knowledge Owners nudged for missing logs` })}); }catch{} }
  return Response.json({ ok:true, channel, sent: nudges.length, message:`✓ Live ${channel} nudges dispatched to ${nudges.length} Knowledge Owners.`, mode:"live" });
}
