import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// This is the correct way neon config - DO NOT change this
neonConfig.webSocketConstructor = ws;
// Disable Neon's websocket protocol - use standard SQL queries
neonConfig.useSecureWebSocket = false;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse the DATABASE_URL to get connection parameters
const dbUrl = new URL(process.env.DATABASE_URL);
export const pool = new Pool({ 
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port || '5432'),
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1) // Remove leading slash
});
export const db = drizzle({ client: pool, schema });