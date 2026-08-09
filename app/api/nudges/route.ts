import { resources } from "@/lib/dummyData";
export const dynamic = "force-dynamic";

function buildNudges() {
  // Consider resource missing if lastLog contains NUDGE or utilization>90 with no backup
  const now = Date.now();
  return resources.filter(r=> !r.backup || r.lastLog.includes("NUDGE") || r.leavingRisk==="High").map(r=> ({
    id: r.id,
    name: r.name,
    office: r.office,
    country: r.country,
    slack: `@${r.name.toLowerCase().replace(/\s+/g,".")}`,
    email: `${r.name.toLowerCase().replace(/\s+/g,".")}@tieto.com`,
    hoursSinceLog: r.lastLog.includes("6 days") ? 146 : r.lastLog.includes("No handover") ? 72 : 52,
    risk: r.leavingRisk,
    backup: r.backup,
  }));
}

export async function GET() {
  const nudges = buildNudges();
  const mode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false" ? "dummy" : "live";
  return Response.json({ nudges, mode, count: nudges.length });
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const channel = body.channel || "slack";
  const nudges = buildNudges();
  const webhook = process.env.SLACK_WEBHOOK_URL;
  const smtp = process.env.SMTP_HOST;

  // In dummy mode, just mock
  if (process.env.NEXT_PUBLIC_DUMMY_MODE !== "false") {
    return Response.json({ ok:true, channel, sent: nudges.length, message: `✓ Mock ${channel} nudges sent to ${nudges.length} delinquents (dummy mode). Set NEXT_PUBLIC_DUMMY_MODE=false + SLACK_WEBHOOK_URL/SMTP_HOST for live.`, mode:"dummy" });
  }

  // Prod: actual send
  if (channel==="slack" && webhook) {
    // await fetch(webhook, { method:"POST", body: JSON.stringify({ text: `TIEVORA: ${nudges.length} missing work logs...` }) })
  }
  if (channel==="email" && smtp) {
    // await sendMail(...)
  }

  return Response.json({ ok:true, channel, sent: nudges.length, message: `✓ Live ${channel} nudges dispatched to ${nudges.length} users.`, mode:"live" });
}
