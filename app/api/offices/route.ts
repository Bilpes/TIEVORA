import { offices } from "@/lib/dummyData";
export const dynamic = "force-dynamic";

// Real API shape: returns offices with business units
// In prod, replace import with DB fetch:
//   const rows = await sql`SELECT * FROM offices WHERE active=true`
//   return Response.json({ offices: rows, mode: "live" })
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const unit = searchParams.get("unit");
  const country = searchParams.get("country");
  let data = offices;
  if (unit) data = data.filter(o=> (o as any).unit===unit);
  if (country) data = data.filter(o=> o.country===country);
  const mode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false" ? "dummy" : "live";
  return Response.json({ offices: data, mode, total: data.length, source: "tieto.com/locations" });
}
