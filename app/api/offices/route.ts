import { offices as dummy } from "@/lib/dummyData";
import { getPool } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const unit = searchParams.get("unit");
  const country = searchParams.get("country");
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (dummyMode) {
    let data: any[] = dummy;
    if (unit) data = data.filter(o=> (o as any).unit===unit);
    if (country) data = data.filter(o=> o.country===country);
    return Response.json({ offices: data, mode:"dummy", total: data.length, source:"tieto.com/locations" });
  }
  const pool = getPool();
  if (!pool) return Response.json({ offices: dummy, mode:"dummy", total: dummy.length, source:"tieto.com/locations (fallback — DATABASE_URL missing)" });
  try {
    const clauses: string[] = [];
    const vals: any[] = [];
    if (unit) { vals.push(unit); clauses.push(`unit = $${vals.length}`); }
    if (country) { vals.push(country); clauses.push(`country = $${vals.length}`); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const { rows } = await pool.query(`SELECT id,city,country,state,address,lat,lng,headcount,projects,pulse,unit,source FROM offices ${where} ORDER BY country, city`, vals);
    return Response.json({ offices: rows, mode:"live", total: rows.length, source:"pg:offices" });
  } catch (e:any) {
    // fallback to dummy on DB error
    return Response.json({ offices: dummy, mode:"dummy-fallback", total: dummy.length, error: e.message });
  }
}
