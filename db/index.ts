import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon to work correctly
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = false;
neonConfig.pipelineConnect = false; // Disable pipeline mode which can cause connection issues

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use direct connection string instead of parsed URL
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000, // 5 seconds timeout
  max: 20, // Maximum number of clients the pool should contain
  idleTimeoutMillis: 30000 // Close idle clients after 30 seconds
});
export const db = drizzle({ client: pool, schema });