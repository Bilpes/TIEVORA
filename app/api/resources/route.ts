import { resources } from "@/lib/dummyData";
export const dynamic = "force-dynamic";
export async function GET() {
  const mode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false" ? "dummy" : "live";
  // Prod: const rows = await hr.fetchResources()
  return Response.json({ resources, mode });
}
