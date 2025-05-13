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

// Seed the SQLite database with some sample data if it's empty
export async function seedSqliteDatabase() {
  const count = sqliteDb.select({ count: sql`count(*)` }).from(sqliteDeals).all();
  if (count.length === 0 || count[0].count === 0) {
    // Create some sample data
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