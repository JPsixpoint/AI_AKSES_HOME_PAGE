// Quick script to print out the deals from the Neon database
const { Pool } = require('pg');

const NEON_DATABASE_URL = "postgresql://scale_owner:uMLhi5Va0Sdx@ep-white-breeze-a5zu57ak-pooler.us-east-2.aws.neon.tech/scale?sslmode=require";

async function viewDeals() {
  const pool = new Pool({
    connectionString: NEON_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to Neon database...');
    
    // Get deals count
    const countResult = await pool.query('SELECT COUNT(*) FROM akses_deals');
    console.log(`Total deals: ${countResult.rows[0].count}`);
    
    // Get sample deals
    const result = await pool.query('SELECT * FROM akses_deals LIMIT 10');
    console.log('\nSample deals:');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await pool.end();
  }
}

viewDeals();