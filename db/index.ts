import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { sqliteDb, sqliteDbOperations } from './sqlite';

let usingSqliteFallback = false;

// Use the specific Neon database URL
const NEON_DATABASE_URL = "postgresql://scale_owner:uMLhi5Va0Sdx@ep-white-breeze-a5zu57ak-pooler.us-east-2.aws.neon.tech/scale?sslmode=require";

// Configure the database connection - prioritize the specified Neon URL
const connectionConfig = { 
  connectionString: NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

// Set pool configuration
const poolConfig = {
  ...connectionConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000 // Reduced timeout for faster fallback
};

// Create the pool
export const pool = new Pool(poolConfig);

// Log connection events to help debug issues
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on database connection:', err);
  usingSqliteFallback = true;
  console.log('Falling back to SQLite database');
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Log the connection attempt (safely)
console.log("Connecting to Neon database:", 
  NEON_DATABASE_URL.replace(/(postgresql:\/\/[^:]+:)[^@]+(@.*)/, "$1****$2"));

// Function to verify database connection
export async function verifyDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection verified:', result.rows[0]);
    usingSqliteFallback = false;
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    usingSqliteFallback = true;
    console.log('Switching to SQLite database');
    return false;
  }
}

// Function to execute database query with fallback to SQLite if PostgreSQL fails
export async function executeQuery(
  pgQuery: string, 
  pgParams: any[] = [], 
  sqliteOperation: () => any
): Promise<any> {
  if (usingSqliteFallback) {
    return sqliteOperation();
  }
  
  try {
    const result = await pool.query(pgQuery, pgParams);
    return result.rows;
  } catch (error) {
    console.error('PostgreSQL query failed, using SQLite fallback:', error);
    usingSqliteFallback = true;
    return sqliteOperation();
  }
}

// Export SQLite operations for use in routes
export { sqliteDbOperations };

// Initialize connection check
verifyDatabaseConnection();