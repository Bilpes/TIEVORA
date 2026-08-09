import { resources as dummy } from "@/lib/dummyData";
import { getPool } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (dummyMode) return Response.json({ resources: dummy, mode:"dummy" });
  const pool = getPool();
  if (!pool) return Response.json({ resources: dummy, mode:"dummy-fallback" });
  try {
    const { rows } = await pool.query(`SELECT id,name,role,office,country,state,utilization,leaving_risk as "leavingRisk",backup,skills,last_log as "lastLog" FROM resources ORDER BY leaving_risk DESC, utilization DESC`);
    const resources = rows.map(r=> ({ ...r, skills: typeof r.skills==="string" ? JSON.parse(r.skills) : r.skills }));
    return Response.json({ resources, mode:"live" });
  } catch (e:any) { return Response.json({ resources: dummy, mode:"dummy-fallback", error:e.message }); }
}
