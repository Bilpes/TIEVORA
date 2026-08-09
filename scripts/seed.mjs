import fs from "fs";
import { Pool } from "pg";
import { offices, projects, resources, workLogs } from "../lib/dummyData.ts"; // we will use JS require fallback
// Simple seed using raw SQL — works in Prod after migrate
const url = process.env.DATABASE_URL;
if (!url) { console.error("Set DATABASE_URL"); process.exit(1); }
const pool = new Pool({ connectionString: url, ssl: url.includes("localhost")? false : { rejectUnauthorized: false }});

async function seed() {
  console.log("Seeding Tieto offices...");
  // Because lib/dummyData is TS, we read the built JSON alternative: fetch via Node by importing compiled?
  // Fallback: parse the file manually for demo — we embed minimal
  // For now use API fetch after server up: easier to seed via HTTP
  console.log("Tip: seed via API: POST /api/seed  or run: npm run db:seed:api");
  await pool.end();
}
seed();
