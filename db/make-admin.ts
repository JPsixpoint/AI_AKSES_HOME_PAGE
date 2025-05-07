import { db, pool } from './index';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function makeAdmin(username: string) {
  try {
    console.log(`Setting user ${username} as admin...`);
    
    const result = await db.update(users)
      .set({ is_admin: true })
      .where(eq(users.username, username))
      .returning();
    
    if (result.length === 0) {
      console.error(`User ${username} not found`);
      return;
    }
    
    console.log(`User ${username} (ID: ${result[0].id}) is now an admin`);
  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Get username from command line argument
const username = process.argv[2];

if (!username) {
  console.error('Please provide a username as an argument');
  process.exit(1);
}

makeAdmin(username); 