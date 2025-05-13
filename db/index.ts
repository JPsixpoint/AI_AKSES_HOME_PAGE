import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { sqliteDb, sqliteDbOperations } from './sqlite';

// Export this variable so it can be imported in other files
export let usingSqliteFallback = false;

// IMPORTANT: Hardcode this database URL for both development and production deployments
// This ensures the database connection works consistently in all environments
const NEON_DATABASE_URL = "postgresql://scale_owner:uMLhi5Va0Sdx@ep-white-breeze-a5zu57ak-pooler.us-east-2.aws.neon.tech/scale?sslmode=require";

// Configure database connection with the exact Neon URL
const connectionConfig = { 
  connectionString: NEON_DATABASE_URL,  // Always use this hardcoded URL, not process.env
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

// Connection details will be logged in verifyDatabaseConnection()

// Function to verify database connection
export async function verifyDatabaseConnection() {
  // Log the database connection details for troubleshooting
  console.log('Attempting to connect to PostgreSQL with URL:', 
    NEON_DATABASE_URL.replace(/(postgresql:\/\/[^:]+:)[^@]+(@.*)/, "$1****$2"));
  
  try {
    const result = await pool.query('SELECT NOW() as now, current_database() as db_name, version() as pg_version');
    console.log('PostgreSQL database connection verified:', result.rows[0]);
    
    // Try a simple query to confirm table access
    try {
      const testQuery = await pool.query('SELECT COUNT(*) FROM akses_deals');
      console.log(`✅ SUCCESS: Connected to akses_deals table with ${testQuery.rows[0].count} records`);
      
      // Get a sample record to confirm data structure
      const sampleQuery = await pool.query('SELECT id, name FROM akses_deals LIMIT 1');
      if (sampleQuery.rows.length > 0) {
        console.log(`Sample record: ID ${sampleQuery.rows[0].id}, Name: ${sampleQuery.rows[0].name}`);
      }
      
      usingSqliteFallback = false;
      return true;
    } catch (error) {
      const tableError = error as Error;
      console.error('❌ ERROR: Failed accessing akses_deals table:', tableError.message);
      console.log('Switching to SQLite database');
      usingSqliteFallback = true;
      return false;
    }
  } catch (error) {
    console.error('❌ ERROR: Failed to connect to PostgreSQL database:', error);
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
  // If we're already using SQLite fallback, continue using it
  if (usingSqliteFallback) {
    return sqliteOperation();
  }
  
  // Try to use the PostgreSQL database first
  try {
    // Verify we can connect before running the query
    try {
      await pool.query('SELECT 1');
    } catch (connError) {
      // Connection failed, log and use SQLite
      console.error('PostgreSQL connection failed, using SQLite fallback:', connError);
      usingSqliteFallback = true;
      return sqliteOperation();
    }
    
    // Run the actual query
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