import { Pool } from "pg";

// Production PG pool — lazy, safe for dummy mode (never connects unless used)
let _pool: Pool | null = null;

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (_pool) return _pool;
  _pool = new Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30000,
    ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : { rejectUnauthorized: false } as any,
  });
  _pool.on("error", (e) => console.error("[db] pool error", e));
  return _pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL not set — run in dummy mode or set DATABASE_URL");
  const res: any = await pool.query(text, params);
  return res;
}

export async function isDbReachable(): Promise<boolean> {
  try {
    const pool = getPool();
    if (!pool) return false;
    await pool.query("SELECT 1");
    return true;
  } catch { return false; }
}
