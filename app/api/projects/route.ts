import { projects as dummy } from "@/lib/dummyData";
import { getPool } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (dummyMode) return Response.json({ projects: dummy, mode:"dummy" });
  const pool = getPool();
  if (!pool) return Response.json({ projects: dummy, mode:"dummy-fallback" });
  try {
    const { rows } = await pool.query(`SELECT id,name,client,region,office_city as office,status,progress,deadline,budget,spent,profit,team,risk,unit FROM projects ORDER BY deadline`);
    return Response.json({ projects: rows, mode:"live" });
  } catch (e:any) { return Response.json({ projects: dummy, mode:"dummy-fallback", error:e.message }); }
}
