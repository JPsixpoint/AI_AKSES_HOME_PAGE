import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Create a SQLite database
const sqlite = new Database('./db/akses.db');

// Define the schema for SQLite (simplified version of the PostgreSQL schema)
export const sqliteDeals = sqliteTable('akses_deals', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  priority: text('priority'),
  country: text('country'),
  lead: text('lead'),
  credit_hub: text('credit_hub'),
  stage: text('stage'),
  updates: text('updates').default('[]'),
  members: text('members').default('[]'),
  pre_screening: text('pre_screening').default('{}'),
  ai_screening: text('ai_screening').default('[]'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Create the SQLite schema
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS akses_deals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    priority TEXT,
    country TEXT,
    lead TEXT,
    credit_hub TEXT,
    stage TEXT,
    updates TEXT DEFAULT '[]',
    members TEXT DEFAULT '[]',
    pre_screening TEXT DEFAULT '{}',
    ai_screening TEXT DEFAULT '[]',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create drizzle instance for SQLite
export const sqliteDb = drizzle(sqlite);

// Function to generate a MongoDB-style ID
function generateMongoId() {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

// Seed the SQLite database with real data from JSON, CSV or sample data as fallback
export async function seedSqliteDatabase() {
  const count = sqliteDb.select({ count: sql`count(*)` }).from(sqliteDeals).all();
  if (count.length === 0 || count[0].count === 0) {
    try {
      // First try to import from JSON (most reliable format)
      console.log("SQLite database is empty. Attempting to import real data...");
      
      const fs = require('fs');
      const path = require('path');
      
      // First try the pre-exported JSON which is more reliable
      const jsonPath = path.join(process.cwd(), 'attached_assets', 'deals-sqlite.json');
      
      if (fs.existsSync(jsonPath)) {
        console.log("Found deals-sqlite.json file, importing data...");
        
        try {
          const dealsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          
          if (Array.isArray(dealsData) && dealsData.length > 0) {
            console.log(`Inserting ${dealsData.length} deals from JSON into SQLite...`);
            
            // Insert in batches to avoid potential memory issues
            const batchSize = 50;
            for (let i = 0; i < dealsData.length; i += batchSize) {
              const batch = dealsData.slice(i, i + batchSize);
              for (const deal of batch) {
                try {
                  sqliteDb.insert(sqliteDeals).values(deal).run();
                } catch (err) {
                  console.error(`Error inserting deal ${deal.name}:`, err);
                }
              }
              console.log(`Inserted batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(dealsData.length/batchSize)}`);
            }
            
            console.log(`Successfully imported ${dealsData.length} deals from JSON into SQLite`);
            return;
          }
        } catch (jsonError) {
          console.error("Error parsing JSON file, trying CSV:", jsonError);
        }
      }
      
      // Fall back to CSV if JSON import fails
      const csvParser = require('csv-parser');
      const csvPath = path.join(process.cwd(), 'attached_assets', 'deals.csv');
      
      if (fs.existsSync(csvPath)) {
        console.log("Found deals.csv file, importing data...");
        
        const dealsFromCsv: any[] = [];
        
        // Parse the CSV file
        await new Promise<void>((resolve, reject) => {
          fs.createReadStream(csvPath)
            .pipe(csvParser())
            .on('data', (row: any) => {
              try {
                // Clean and normalize the data
                const formattedUpdates = typeof row.updates === 'string' ? 
                  (row.updates.startsWith('[object Object]') ? 
                    JSON.stringify([{ date: new Date().toISOString(), content: "Imported from CSV" }]) : 
                    row.updates) : 
                  JSON.stringify([]);
                
                const formattedPreScreening = typeof row.pre_screening === 'string' ? 
                  (row.pre_screening.startsWith('[object Object]') ? 
                    JSON.stringify({}) : 
                    row.pre_screening) : 
                  JSON.stringify({});
                
                const formattedMembers = typeof row.members === 'string' ? 
                  (row.members === '[]' ? row.members : 
                   (row.members.startsWith('[') ? row.members : JSON.stringify([]))) : 
                  JSON.stringify([]);
                
                const deal = {
                  id: row.id || generateMongoId(),
                  name: row.name || `Unknown Deal ${generateMongoId().substring(0, 6)}`,
                  priority: row.priority || "Medium",
                  country: row.country || "",
                  lead: row.lead || "",
                  credit_hub: row.credit_hub || "",
                  stage: row.stage || "Lead",
                  updates: formattedUpdates,
                  members: formattedMembers,
                  pre_screening: formattedPreScreening,
                  ai_screening: JSON.stringify([])
                };
                
                dealsFromCsv.push(deal);
              } catch (err) {
                console.error("Error processing CSV row:", err);
              }
            })
            .on('end', () => {
              console.log(`Parsed ${dealsFromCsv.length} deals from CSV`);
              resolve();
            })
            .on('error', (err: any) => {
              console.error("Error reading CSV:", err);
              reject(err);
            });
        });
        
        if (dealsFromCsv.length > 0) {
          console.log(`Inserting ${dealsFromCsv.length} deals from CSV into SQLite...`);
          
          // Insert in batches to avoid potential memory issues
          const batchSize = 50;
          for (let i = 0; i < dealsFromCsv.length; i += batchSize) {
            const batch = dealsFromCsv.slice(i, i + batchSize);
            for (const deal of batch) {
              try {
                sqliteDb.insert(sqliteDeals).values(deal).run();
              } catch (err) {
                console.error(`Error inserting deal ${deal.name}:`, err);
              }
            }
            console.log(`Inserted batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(dealsFromCsv.length/batchSize)}`);
          }
          
          console.log(`Successfully imported ${dealsFromCsv.length} deals from CSV into SQLite`);
          return;
        }
      } else {
        console.log("deals.csv not found in attached_assets folder, falling back to sample data");
      }
    } catch (importError) {
      console.error("Error importing from data files, falling back to sample data:", importError);
    }
    
    // Create some sample data as fallback
    console.log("Using sample fallback data for SQLite database");
    const dealsData = [
      {
        id: generateMongoId(),
        name: "Fintech Solutions Ltd.",
        priority: "High",
        country: "Southeast Asia",
        lead: "contact@sixpointcapital.com",
        credit_hub: "LATAM",
        stage: "Due Diligence & U/W",
        updates: JSON.stringify([{ 
          date: new Date().toISOString(),
          content: "Deal entered due diligence phase."
        }]),
        members: JSON.stringify(["team@sixpointcapital.com"]),
        pre_screening: JSON.stringify({}),
        ai_screening: JSON.stringify([])
      },
      {
        id: generateMongoId(),
        name: "Pay Global Inc.",
        priority: "Medium",
        country: "North America",
        lead: "contact@sixpointcapital.com",
        credit_hub: "EMENA",
        stage: "Due Diligence & U/W",
        updates: JSON.stringify([{ 
          date: new Date().toISOString(),
          content: "Initial assessment completed."
        }]),
        members: JSON.stringify(["team@sixpointcapital.com"]),
        pre_screening: JSON.stringify({}),
        ai_screening: JSON.stringify([])
      },
      {
        id: generateMongoId(),
        name: "Credit Access Partners",
        priority: "High",
        country: "Europe",
        lead: "partner@ventureeast.com",
        credit_hub: "EMENA",
        stage: "Due Diligence & U/W",
        updates: JSON.stringify([]),
        members: JSON.stringify(["team@sixpointcapital.com"]),
        pre_screening: JSON.stringify({}),
        ai_screening: JSON.stringify([])
      },
      {
        id: generateMongoId(),
        name: "Mobile Money Solutions",
        priority: "Medium",
        country: "Africa",
        lead: "invest@africagrowth.fund",
        credit_hub: "SSA",
        stage: "Pre-Screening",
        updates: JSON.stringify([]),
        members: JSON.stringify(["team@sixpointcapital.com"]),
        pre_screening: JSON.stringify({}),
        ai_screening: JSON.stringify([])
      },
      {
        id: generateMongoId(),
        name: "InsurTech Innovations",
        priority: "Medium",
        country: "Asia Pacific",
        lead: "deals@techseedsasia.com",
        credit_hub: "APAC",
        stage: "Pre-Screening",
        updates: JSON.stringify([]),
        members: JSON.stringify(["team@sixpointcapital.com"]),
        pre_screening: JSON.stringify({}),
        ai_screening: JSON.stringify([])
      },
      {
        id: generateMongoId(),
        name: "Remittance Connect",
        priority: "High",
        country: "Latin America",
        lead: "invest@latamventures.com",
        credit_hub: "LATAM",
        stage: "Pre-Screening",
        updates: JSON.stringify([]),
        members: JSON.stringify(["team@sixpointcapital.com"]),
        pre_screening: JSON.stringify({}),
        ai_screening: JSON.stringify([])
      }
    ];

    // Insert sample data
    for (const deal of dealsData) {
      sqliteDb.insert(sqliteDeals).values(deal).run();
    }

    console.log('SQLite database seeded with sample data');
  } else {
    console.log(`SQLite database already has ${count[0].count} records`);
  }
}

// Export functions for dealing with the SQLite database
export const sqliteDbOperations = {
  getAllDeals: () => {
    return sqliteDb.select().from(sqliteDeals).all();
  },
  
  getDealById: (id: string) => {
    return sqliteDb.select().from(sqliteDeals).where(sql`id = ${id}`).all();
  },
  
  getDealsByStage: (stage: string) => {
    return sqliteDb.select().from(sqliteDeals).where(sql`stage = ${stage}`).all();
  },
  
  getStatistics: () => {
    // Get total count
    const totalResult = sqliteDb.select({ count: sql`count(*)` }).from(sqliteDeals).all();
    const totalDeals = totalResult[0]?.count as number;
    
    // Get stage counts (using simplified approach due to SQLite limitations)
    const stageStats: Record<string, number> = {};
    const stages = sqliteDb.select({ stage: sqliteDeals.stage, count: sql`count(*)` })
      .from(sqliteDeals)
      .groupBy(sqliteDeals.stage)
      .all();
      
    stages.forEach(row => {
      stageStats[row.stage || 'Unknown'] = row.count as number;
    });
    
    // Get credit hub counts
    const creditHubStats: Record<string, number> = {};
    const hubs = sqliteDb.select({ hub: sqliteDeals.credit_hub, count: sql`count(*)` })
      .from(sqliteDeals)
      .groupBy(sqliteDeals.credit_hub)
      .all();
      
    hubs.forEach(row => {
      creditHubStats[row.hub || 'Unknown'] = row.count as number;
    });
    
    // Calculate specific counts
    const dueDiligenceCount = stageStats['Due Diligence & U/W'] || 0;
    const prescreeningCount = stageStats['Pre-Screening'] || 0;
    const leadCount = stageStats['Lead'] || 0;
    const closedCount = (stageStats['Closed - Won'] || 0) + (stageStats['Closed - Lost'] || 0);
    
    return {
      totalDeals,
      stageStats,
      creditHubStats,
      dueDiligenceCount,
      prescreeningCount,
      leadCount,
      closedCount,
      valueChangePercent: 15,  // Static for demo
      newDealsThisMonth: 3,    // Static for demo
      dueDiligenceChangeWeekly: 0,
      completedThisQuarter: 2
    };
  }
};

// Initialize and seed the SQLite database
seedSqliteDatabase();