import { opportunities } from "@/lib/sales";
export const dynamic = "force-dynamic";

// In dummy mode, return curated pipeline. In live mode, this would call Tavily/SerpAPI + TED/Hilma parsers + LLM scorer.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const unit = searchParams.get("unit");
  const country = searchParams.get("country");
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  let data = [...opportunities];
  if (q) data = data.filter(o=> `${o.title} ${o.buyer} ${o.description} ${o.skills.join(" ")}`.toLowerCase().includes(q));
  if (unit) data = data.filter(o=> o.unit===unit);
  if (country) data = data.filter(o=> o.country===country);
  // Live: if !dummyMode, perform real web search here (example: Tavily)
  // const live = await tavily.search({ query: "RFP tender Tieto public sector Finland Sweden", time: "week" });
  // data = await Promise.all(live.results.map(enrichOpportunity));
  return Response.json({ opportunities: data, mode: dummyMode ? "dummy" : "live-dummy-fallback", total: data.length, pipelineEUR: data.reduce((s,o)=>s+o.valueEUR,0), sources: ["TED.europa.eu","Hilma.fi","Upphandling.se","Mercell","Prozorro","Tavily web search"] });
}
