const { Pool } = require('pg');

async function checkTables() {
  const pool = new Pool({
    connectionString: 'postgresql://scale_owner:uMLhi5Va0Sdx@ep-white-breeze-a5zu57ak-pooler.us-east-2.aws.neon.tech/scale?sslmode=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Neon database...');
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Available tables:', res.rows.map(row => row.table_name));
    
    // Try to count the rows in akses_deals
    try {
      const countRes = await pool.query('SELECT COUNT(*) FROM akses_deals');
      console.log('Number of rows in akses_deals:', countRes.rows[0].count);
    } catch (err) {
      console.error('Error querying akses_deals:', err.message);
    }
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
}

checkTables();
