import { db } from "../db";
import { users } from "../shared/schema";
import { sql } from "drizzle-orm";

async function createUsersTable() {
  try {
    console.log("Creating users table...");
    
    // First check if the table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const exists = tableExists.rows[0]?.exists === true;
    
    if (exists) {
      console.log("Users table already exists. Checking schema...");
      
      // Check if we need to add the role column
      const roleColumnExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users' 
          AND column_name = 'role'
        );
      `);
      
      if (roleColumnExists.rows[0]?.exists === false) {
        console.log("Adding role column to users table...");
        await db.execute(sql`
          ALTER TABLE users 
          ADD COLUMN role TEXT NOT NULL DEFAULT 'viewer';
        `);
        console.log("Role column added successfully.");
      } else {
        console.log("Role column already exists.");
      }
      
      // Check for other columns we might need to add
      const columnsToCheck = [
        'department', 'is_active', 'last_login', 'created_at'
      ];
      
      for (const col of columnsToCheck) {
        const colExists = await db.execute(sql`
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'users' 
            AND column_name = ${col}
          );
        `);
        
        if (colExists.rows[0]?.exists === false) {
          console.log(`Adding ${col} column to users table...`);
          if (col === 'is_active') {
            await db.execute(sql`
              ALTER TABLE users 
              ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
            `);
          } else if (col === 'created_at' || col === 'last_login') {
            await db.execute(sql`
              ALTER TABLE users 
              ADD COLUMN ${sql.identifier(col)} TIMESTAMP;
            `);
          } else {
            await db.execute(sql`
              ALTER TABLE users 
              ADD COLUMN ${sql.identifier(col)} TEXT;
            `);
          }
          console.log(`${col} column added successfully.`);
        }
      }
      
    } else {
      // Create the table from scratch
      console.log("Creating users table from scratch...");
      await db.execute(sql`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT NOT NULL,
          full_name TEXT,
          role TEXT NOT NULL DEFAULT 'viewer',
          department TEXT,
          is_active BOOLEAN NOT NULL DEFAULT true,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log("Users table created successfully.");
    }
    
    // Add a sample admin user if the table is empty
    const userCount = await db.execute(sql`SELECT COUNT(*) FROM users`);
    if (parseInt(userCount.rows[0]?.count) === 0) {
      console.log("Adding sample admin user...");
      await db.execute(sql`
        INSERT INTO users (username, password, email, full_name, role, department)
        VALUES ('admin', 'adminpassword', 'admin@akses.com', 'System Administrator', 'admin', 'IT')
      `);
      console.log("Sample admin user added successfully.");
    }
    
    console.log("Users table setup completed successfully.");
  } catch (error) {
    console.error("Error setting up users table:", error);
  } finally {
    process.exit(0);
  }
}

createUsersTable();