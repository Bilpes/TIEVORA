import { ragQuery } from "@/lib/rag";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (!q.trim()) return Response.json({ results: [], query: q });
  const results = ragQuery(q);
  return Response.json({ query: q, results, hint: "Swap lib/rag.ts with pgvector + embeddings for prod" });
}
