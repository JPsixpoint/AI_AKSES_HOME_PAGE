import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { sqliteDb, sqliteDbOperations } from './sqlite';

let usingSqliteFallback = false;

// Configure the database connection - prioritize the Replit DATABASE_URL
const useConnectionString = process.env.DATABASE_URL ? true : false;

// Create a connection config object either from connection string or individual params
const connectionConfig = useConnectionString 
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('amazonaws.com') ? {
        rejectUnauthorized: false
      } : undefined
    }
  : {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE
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
if (useConnectionString) {
  console.log("Connecting to database with connection string:", 
    process.env.DATABASE_URL?.replace(/(postgresql:\/\/[^:]+:)[^@]+(@.*)/, "$1****$2"));
} else {
  console.log(`Connecting to database at ${process.env.PGHOST}:${process.env.PGPORT} as ${process.env.PGUSER}`);
}

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