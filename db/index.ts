import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon to work correctly with the new database
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use the new database connection string
const DB_URL = "postgresql://aksesPipeline_owner:npg_Zgtbpq8FG1Vf@ep-summer-hall-a406gfgc-pooler.us-east-1.aws.neon.tech/aksesPipeline?sslmode=require";
export const pool = new Pool({ 
  connectionString: DB_URL,
  connectionTimeoutMillis: 5000, // 5 seconds timeout
  max: 20, // Maximum number of clients the pool should contain
  idleTimeoutMillis: 30000 // Close idle clients after 30 seconds
});
export const db = drizzle({ client: pool, schema });