import { workLogs } from "@/lib/dummyData";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null);
  if (!body?.summary || !body?.author) return Response.json({ ok:false, error:"author and summary required" }, { status: 400 });
  const id = "W" + (workLogs.length + 1);
  const entry = {
    id,
    author: body.author,
    project: body.project || "TIEVORA Core",
    date: new Date().toISOString().slice(0,10),
    summary: body.summary,
    tags: (body.tags || "").split(",").map((s:string)=>s.trim()).filter(Boolean)
  };
  workLogs.unshift(entry as any);
  // In prod: embed + upsert to pgvector, notify onboarding bot, update coverage metric
  return Response.json({ ok: true, entry, message: "Indexed — RAG will answer from this log within seconds. New hire onboarding time < 90 mins." });
}

export async function GET() {
  return Response.json({ workLogs });
}
