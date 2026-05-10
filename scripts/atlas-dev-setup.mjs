/**
 * Sets up a clean atlas_dev database for Atlas migrate diff.
 *
 * Atlas requires its dev database to be empty. We use a separate database
 * (atlas_dev) created from template0 so Supabase's built-in schemas (auth,
 * storage, etc.) are not present. Only the minimal auth stubs needed by
 * schema.sql are added.
 *
 * Run via: npm run atlas:setup
 */

import { spawnSync } from "child_process";

const MAIN_DB =
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres?sslmode=disable";
const DEV_DB =
  "postgresql://postgres:postgres@127.0.0.1:54322/atlas_dev?sslmode=disable";

function query(sql, dbUrl = MAIN_DB) {
  const args =
    dbUrl === MAIN_DB
      ? ["db", "query", sql]
      : ["db", "query", "--db-url", dbUrl, sql];
  const result = spawnSync("supabase", args, {
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("Setting up atlas_dev...");

// Terminate any lingering connections so we can drop the database
query(
  `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'atlas_dev' AND pid <> pg_backend_pid()`,
);
query("DROP DATABASE IF EXISTS atlas_dev");
query("CREATE DATABASE atlas_dev TEMPLATE template0");

// Minimal auth stubs — only what schema.sql references
query("CREATE SCHEMA auth", DEV_DB);
query("CREATE TABLE auth.users (id uuid PRIMARY KEY, email text)", DEV_DB);
// Use dollar-quoting to avoid shell escaping issues with single quotes
query(
  `CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT '00000000-0000-0000-0000-000000000000'::uuid $$`,
  DEV_DB,
);
// Empty target schema — Atlas replays migrations into this
query("CREATE SCHEMA guestbook", DEV_DB);

console.log("atlas_dev ready.");
