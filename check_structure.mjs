import pg from 'pg';
const { Pool } = pg;

async function checkTableStructure() {
  const pool = new Pool({
    connectionString: 'postgresql://scale_owner:uMLhi5Va0Sdx@ep-white-breeze-a5zu57ak-pooler.us-east-2.aws.neon.tech/scale?sslmode=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Checking table structure for akses_deals...');
    const res = await pool.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'akses_deals'
      ORDER BY ordinal_position;
    `);
    
    console.log('Table structure:', res.rows);
    
    // Get a sample row to see actual data
    const sampleRes = await pool.query('SELECT * FROM akses_deals LIMIT 1');
    console.log('\nSample row data:', sampleRes.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
}

checkTableStructure();
