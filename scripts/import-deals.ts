import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import { db } from '../db/index.js';
import { sixpointDeals } from '../shared/schema.js';
import { sql, eq } from 'drizzle-orm';

// ES module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_FILE_PATH = path.resolve(__dirname, './data/deals.csv');

// Helper function to safely parse JSON or return empty object/array
function safeParseJson(jsonString: string, defaultValue: any = {}): any {
  if (!jsonString || jsonString === '[object Object]') {
    return defaultValue;
  }
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON string:', jsonString);
    return defaultValue;
  }
}

// Helper function to clean CSV values
function cleanValue(value: any): any {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  if (typeof value === 'string') {
    // Handle object notation that couldn't be parsed
    if (value.includes('[object Object]')) {
      if (value === '[object Object]') {
        return {};
      }
      
      // For arrays of [object Object]
      if (value.startsWith('[object Object]') && value.includes(',')) {
        return [];
      }
    }
  }
  
  return value;
}

async function importDeals() {
  console.log('Starting import of deals from CSV...');
  
  const results: any[] = [];
  
  // Read and parse the CSV file
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`Read ${results.length} records from CSV`);
        resolve();
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
  
  console.log('Preparing data for import...');
  
  // Process the data and prepare for insertion
  const dealsToInsert = results.map(row => {
    // Process members field - it could be an array or string
    let members: string[] = [];
    if (row.members) {
      try {
        members = JSON.parse(row.members);
      } catch (e) {
        // If it's a string like "[]", make it an empty array
        members = [];
      }
    }
    
    // Parse created_at date
    let createdAt: Date | null = null;
    try {
      if (row.created_at) {
        createdAt = new Date(row.created_at);
      }
    } catch (e) {
      console.warn('Invalid date format for row:', row.id);
      createdAt = null;
    }
    
    // Safe parsing of JSON fields
    const updates = row.updates && row.updates !== '' ? 
      safeParseJson(row.updates, []) : 
      [];
      
    const preScreening = row.pre_screening && row.pre_screening !== '' ? 
      safeParseJson(row.pre_screening, {}) : 
      {};
      
    const contacts = row.contacts && row.contacts !== '' ? 
      safeParseJson(row.contacts, {}) : 
      {};
    
    // Create a properly structured record
    return {
      id: row.id,
      name: cleanValue(row.name),
      lead: cleanValue(row.lead),
      country: cleanValue(row.country),
      creditHub: cleanValue(row.credit_hub),
      stage: cleanValue(row.stage),
      priority: cleanValue(row.priority),
      updates: updates,
      preScreening: preScreening,
      members: members,
      createdAt: createdAt,
      contacts: contacts
    };
  });
  
  // Insert the data in batches to avoid overwhelming the database
  console.log('Inserting data into database...');
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < dealsToInsert.length; i += BATCH_SIZE) {
    const batch = dealsToInsert.slice(i, i + BATCH_SIZE);
    try {
      await db.insert(sixpointDeals).values(batch).onConflictDoUpdate({
        target: sixpointDeals.id,
        set: {
          name: sql`EXCLUDED."name"`,
          lead: sql`EXCLUDED."lead"`,
          country: sql`EXCLUDED."country"`,
          creditHub: sql`EXCLUDED."credit_hub"`,
          stage: sql`EXCLUDED."stage"`,
          priority: sql`EXCLUDED."priority"`,
          updates: sql`EXCLUDED."updates"`,
          preScreening: sql`EXCLUDED."pre_screening"`,
          members: sql`EXCLUDED."members"`,
          createdAt: sql`EXCLUDED."created_at"`,
          contacts: sql`EXCLUDED."contacts"`,
          importedAt: sql`NOW()`
        }
      });
      console.log(`Inserted/updated batch ${i/BATCH_SIZE + 1} of ${Math.ceil(dealsToInsert.length/BATCH_SIZE)}`);
    } catch (error) {
      console.error(`Error inserting batch starting at index ${i}:`, error);
    }
  }
  
  console.log('Import completed!');
  
  // Count the records to verify
  const count = await db.select({ count: sql`count(*)` }).from(sixpointDeals);
  console.log(`Total records in sixpoint_deals table: ${count[0].count}`);
}

// Execute the import function
importDeals()
  .then(() => {
    console.log('Script execution completed.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script execution failed:', error);
    process.exit(1);
  });