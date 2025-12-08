import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema.ts";

if (!process.env.DATABASE_URL) {
  throw new Error("No existe DATABASE_URL");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // 'require' is not a valid ConnectionOptions property; keep supported TLS options
    rejectUnauthorized: false   // <--- EVITA EL ERROR DE CERTIFICADO
  }
});

export const db = drizzle(pool, { schema });
export { schema };
