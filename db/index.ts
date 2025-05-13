import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

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
  connectionTimeoutMillis: 10000
};

// Create the pool
export const pool = new Pool(poolConfig);

// Log connection events to help debug issues
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on database connection:', err);
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

// Function to verify database connection and table existence
export async function verifyDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection verified:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return false;
  }
}

// Initialize connection check
verifyDatabaseConnection();