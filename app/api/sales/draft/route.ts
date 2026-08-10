import { opportunities } from "@/lib/sales";
import { offices } from "@/lib/dummyData";
export const dynamic = "force-dynamic";

function buildDraft(oppId: string, tone: string = "CEO") {
  const opp = opportunities.find(o=> o.id===oppId);
  if (!opp) throw new Error("Opportunity not found");
  const office = offices.find(o=> o.country===opp.country) || offices[0];
  const subject = tone==="CEO"
    ? `Tieto — ${opp.unit} proposal for ${opp.buyer}: ${opp.title.slice(0,60)}`
    : `Re: ${opp.title} — quick Tieto POC?`;
  const body = `Hi ${opp.contactName.split(" ")[0]},

I’m writing from Tieto (ex-Tietoevry) — we noticed ${opp.buyer}’s tender "${opp.title}" on ${opp.source} (deadline ${opp.deadline}, ~€${(opp.valueEUR/1000000).toFixed(1)}M).

Why Tieto wins here:
• ${opp.hunterNote}
• Delivery from ${office.city} + ${opp.unit} pod (Create/Transform/Banking as needed) — ${opp.skills.slice(0,3).join(", ")} accelerators ready.
• References: ${opp.competitors.length ? `We’ve beaten ${opp.competitors[0]} in similar bids by 20-30% on cost/time` : "Proven in 7 hospital FHIR rollout"}.
• Fit score ${opp.fitScore}% — win prob ${opp.winProb}% per our model.

Vs competitors (${opp.competitors.join(", ")}), our edge is on-site + nearshore hybrid (Espoo/Stockholm + Pune/Szczecin/Kyiv) + fixed-price pilot in 6 weeks.

Can we set up a 25-min call this week? I can share a 2-pager + CEO intro.

Best,
CEO, Tieto
${office.address}
Direct: info@tieto.com | ${opp.contactEmail}

—
Hunter intel: Source ${opp.sourceUrl}
Next step: Hunter will auto-nudge if no reply in 48h.
`;
  const ctaEmail = opp.contactEmail;
  return { subject, body, to: ctaEmail, cc: "sales@tieto.com", hunterNote: opp.hunterNote, competitors: opp.competitors, office: office.city, tone };
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const oppId = body.oppId || body.id;
  const tone = body.tone || "CEO";
  if (!oppId) return Response.json({ ok:false, error:"oppId required" }, { status:400 });
  try {
    const draft = buildDraft(oppId, tone);
    // In live mode, LLM would personalize: await openai.chat.completions.create({ model:"gpt-4o", messages:[{role:"system", content:"You are Tieto sales..."},{role:"user", content: JSON.stringify(opp)}]})
    // And hunter would fetch verified email via Hunter.io / Apollo
    return Response.json({ ok:true, draft, mode: process.env.NEXT_PUBLIC_DUMMY_MODE !== "false" ? "dummy" : "live" });
  } catch (e:any) { return Response.json({ ok:false, error:e.message }, { status:404 }); }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const oppId = searchParams.get("oppId");
  if (!oppId) return Response.json({ ok:false, error:"oppId query required" }, { status:400 });
  try {
    const draft = buildDraft(oppId, "CEO");
    return Response.json({ ok:true, draft });
  } catch (e:any) { return Response.json({ ok:false, error:e.message }, { status:404 }); }
}
