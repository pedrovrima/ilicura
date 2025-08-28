import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Usage:
//   npm run db:migrate:one -- ./drizzle/002_audit_triggers.sql
// or (TS migration exporting `up`):
//   npm run db:migrate:one -- ./drizzle/002_audit_triggers.ts
//
// If you pass only a folder (e.g., ./drizzle), it runs THE LAST file in it (lexicographically).

async function main() {
  const arg = process.argv[2] ?? "./drizzle";
  let targetPath = path.resolve(process.cwd(), arg);

  // If a directory was passed, pick the "last" file by name (ignores *.down.*)
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    const files = fs
      .readdirSync(targetPath)
      .filter((n) => /\.(sql|ts|js)$/.test(n) && !/\.down\./i.test(n))
      .sort();
    if (files.length === 0)
      throw new Error(`No migration files in ${targetPath}`);
    targetPath = path.join(targetPath, files[files.length - 1]);
  }

  console.log(
    `➡️  Running single migration: ${path.relative(process.cwd(), targetPath)}`,
  );

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    if (targetPath.endsWith(".sql")) {
      const sqlText = fs.readFileSync(targetPath, "utf8");
      await pool.query(sqlText);
    } else {
      const mod = await import(pathToFileURL(targetPath).href);
      if (!mod.up || typeof mod.up !== "function") {
        throw new Error(
          "TS/JS migration must export an async `up(db)` function.",
        );
      }
      await mod.up(db);
    }
    console.log("✅ Done");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
