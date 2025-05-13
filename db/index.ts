import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use the environment variable if available, otherwise use the hardcoded value
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://scale_owner:uMLhi5Va0Sdx@ep-white-breeze-a5zu57ak-pooler.us-east-2.aws.neon.tech/scale?sslmode=require";

// Configure the PostgreSQL connection pool with proper settings
export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // This helps with Neon database connections in some environments
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 10000, // How long to try to connect before timing out
});

// Log connection events to help debug issues
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Log the connection attempt with masked credentials
console.log("Connecting to database:", DATABASE_URL.replace(/(postgresql:\/\/[^:]+:)[^@]+(@.*)/, "$1****$2"));