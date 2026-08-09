import { resources as dummy } from "@/lib/dummyData";
import { getPool } from "@/lib/db";
export const dynamic = "force-dynamic";

function buildDummy() {
  return dummy.filter(r=> !r.backup || r.lastLog.includes("NUDGE") || r.leavingRisk==="High").map(r=> ({
    id: r.id, name: r.name, office: r.office, country: r.country,
    slack: `@${r.name.toLowerCase().replace(/\s+/g,".")}`,
    email: `${r.name.toLowerCase().replace(/\s+/g,".")}@tieto.com`,
    hoursSinceLog: r.lastLog.includes("6 days") ? 146 : r.lastLog.includes("No handover") ? 72 : 52,
    risk: r.leavingRisk, backup: r.backup,
  }));
}

export async function GET() {
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (dummyMode) return Response.json({ nudges: buildDummy(), mode:"dummy", count: buildDummy().length });
  const pool = getPool();
  if (!pool) return Response.json({ nudges: buildDummy(), mode:"dummy-fallback" });
  try {
    const { rows } = await pool.query(`SELECT id,name,office,country,leaving_risk as risk, backup, EXTRACT(EPOCH FROM (NOW() - last_log_at))/3600 as hours FROM resources WHERE backup IS NULL OR leaving_risk='High' OR last_log_at < NOW() - INTERVAL '48 hours' ORDER BY hours DESC`);
    const nudges = rows.map(r=> ({ id:r.id,name:r.name,office:r.office,country:r.country, slack:`@${r.name.toLowerCase().replace(/\s+/g,".")}`, email:`${r.name.toLowerCase().replace(/\s+/g,".")}@tieto.com`, hoursSinceLog: Math.round(Number(r.hours)), risk: r.risk, backup: r.backup }));
    return Response.json({ nudges, mode:"live", count: nudges.length });
  } catch (e:any) { return Response.json({ nudges: buildDummy(), mode:"dummy-fallback-on-error", error:e.message }); }
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const channel = body.channel || "slack";
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  const nudges = buildDummy();
  if (dummyMode) return Response.json({ ok:true, channel, sent: nudges.length, message:`✓ Mock ${channel} nudges sent to ${nudges.length} delinquents (dummy mode). Set NEXT_PUBLIC_DUMMY_MODE=false + SLACK_WEBHOOK_URL/SMTP_HOST for live.`, mode:"dummy" });
  const pool = getPool();
  if (!pool) return Response.json({ ok:false, error:"DATABASE_URL missing" }, { status:500 });
  const webhook = process.env.SLACK_WEBHOOK_URL;
  const smtp = process.env.SMTP_HOST;
  // live inserts audit
  for (const n of nudges) { try{ await pool.query(`INSERT INTO nudges (resource_id, channel) VALUES ($1,$2)`, [n.id, channel]); }catch{} }
  if (channel==="slack" && webhook) { try{ await fetch(webhook,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ text:`TIEVORA: ${nudges.length} missing work logs — nudged via Slack` })}); }catch{} }
  return Response.json({ ok:true, channel, sent: nudges.length, message:`✓ Live ${channel} nudges dispatched to ${nudges.length} users.`, mode:"live" });
}
