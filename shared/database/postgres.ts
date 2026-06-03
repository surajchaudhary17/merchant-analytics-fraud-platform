import { Pool } from "pg";
import { env } from "@shared/config/env";

export const postgresPool = new Pool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const connectPostgres = async () => {
  try {
    const client = await postgresPool.connect();

    console.log("✅ PostgreSQL Connected");

    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed");
    console.error(error);

    process.exit(1);
  }
};
