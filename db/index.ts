import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use the specific database URL regardless of environment variable
const DATABASE_URL = "postgresql://scale_owner:uMLhi5Va0Sdx@ep-white-breeze-a5zu57ak-pooler.us-east-2.aws.neon.tech/scale?sslmode=require";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });

// Log the connection attempt
console.log("Connecting to database:", DATABASE_URL.replace(/(postgresql:\/\/[^:]+:)[^@]+(@.*)/, "$1****$2"));