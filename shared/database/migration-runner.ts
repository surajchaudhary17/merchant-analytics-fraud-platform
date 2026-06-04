import fs from "fs";
import path from "path";

import { postgresPool } from "./postgres";

const MIGRATION_TABLE = "migrations";

export const runMigrations = async () => {
  const migrationDir = path.join(__dirname, "migrations");

  console.log(`🔄 Running migrations from: ${migrationDir}`);

  if (!fs.existsSync(migrationDir)) {
    throw new Error(`Migration directory not found: ${migrationDir}`);
  }

  // Create migration tracking table if it doesn't exist
  await postgresPool.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const files = fs
    .readdirSync(migrationDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("⚠️ No migrations found.");
    return;
  }

  let executedCount = 0;

  for (const file of files) {
    const existingMigration = await postgresPool.query(
      `
      SELECT migration_name
      FROM migrations
      WHERE migration_name = $1
      `,
      [file],
    );

    if (existingMigration.rowCount) {
      console.log(`⏭️ Skipping migration: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationDir, file), "utf-8");

    const client = await postgresPool.connect();

    try {
      await client.query("BEGIN");

      await client.query(sql);

      await client.query(
        `
        INSERT INTO migrations(migration_name)
        VALUES($1)
        `,
        [file],
      );

      await client.query("COMMIT");

      executedCount++;

      console.log(`✅ Migration executed: ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");

      console.error(`❌ Migration failed: ${file}`);

      throw error;
    } finally {
      client.release();
    }
  }

  console.log(
    `🚀 Migration process complete. Executed ${executedCount} migration(s).`,
  );
};
