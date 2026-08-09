import fs from "fs";
import { Pool } from "pg";
const url = process.env.DATABASE_URL;
if (!url) { console.error("Set DATABASE_URL"); process.exit(1); }
const pool = new Pool({ connectionString: url, ssl: url.includes("localhost")? false : { rejectUnauthorized: false }});
const sql = fs.readFileSync("db/schema.sql","utf8");
console.log("Migrating...");
pool.query(sql).then(()=> { console.log("✓ Schema applied"); process.exit(0); }).catch(e=> { console.error(e); process.exit(1); });
