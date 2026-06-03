import dotenv from "dotenv";
import { z } from "zod";
import path from "path";

// dotenv.config({
//   path: path.resolve(__dirname, "../../../.env"),
// });
const envPath = path.resolve(process.cwd(), "../../.env");

dotenv.config({
  path: envPath,
});

const envSchema = z.object({
  PORT: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  REDIS_URL: z.string(),

  RABBITMQ_URL: z.string(),

  JWT_SECRET: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
