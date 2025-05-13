import { db, pool, verifyDatabaseConnection } from "./index";
import * as schema from "@shared/schema";
import { deals } from "@shared/schema";

// Function to generate a MongoDB-style ID
function generateMongoId() {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

async function createAksesDealsTable() {
  try {
    // Check if the akses_deals table exists
    const tableCheck = await pool.query("SELECT to_regclass('akses_deals') IS NOT NULL as exists");
    const tableExists = tableCheck.rows[0]?.exists;

    if (!tableExists) {
      console.log("Creating akses_deals table...");
      
      // Create the table with the proper schema
      await pool.query(`
        CREATE TABLE akses_deals (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          priority TEXT,
          country TEXT,
          lead TEXT,
          credit_hub TEXT,
          stage TEXT,
          updates JSONB DEFAULT '[]',
          members JSONB DEFAULT '[]',
          pre_screening JSONB DEFAULT '{}',
          ai_screening JSONB DEFAULT '[]',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      
      console.log("akses_deals table created successfully!");
      return true;
    } else {
      console.log("akses_deals table already exists");
      return true;
    }
  } catch (error) {
    console.error("Error creating akses_deals table:", error);
    return false;
  }
}

async function seed() {
  try {
    // First verify database connection
    const isConnected = await verifyDatabaseConnection();
    
    if (!isConnected) {
      console.error("Cannot connect to database. Aborting seed operation.");
      return;
    }
    
    // Create the akses_deals table if it doesn't exist
    const tableCreated = await createAksesDealsTable();
    
    if (!tableCreated) {
      console.error("Failed to create or verify akses_deals table. Aborting seed operation.");
      return;
    }
    
    // Check if we already have deals in the table
    const dealsCountResult = await pool.query("SELECT COUNT(*) FROM akses_deals");
    const dealsCount = parseInt(dealsCountResult.rows[0].count);
    
    if (dealsCount > 0) {
      console.log(`Table already has ${dealsCount} deals. Skipping seed.`);
      return;
    }
    
    console.log("Seeding deals data...");
    
    // Create sample deals
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
    
    // Insert all deals 
    for (const deal of dealsData) {
      const fields = Object.keys(deal).join(', ');
      const placeholders = Object.keys(deal).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(deal);
      
      const query = `INSERT INTO akses_deals (${fields}) VALUES (${placeholders})`;
      await pool.query(query, values);
    }
    
    // Verify data was inserted
    const finalCountResult = await pool.query("SELECT COUNT(*) FROM akses_deals");
    const finalCount = parseInt(finalCountResult.rows[0].count);
    
    console.log(`Deals data seeded successfully! Total deals: ${finalCount}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // End the pool to avoid hanging processes
    // Commented out to keep the pool available for the application
    // await pool.end();  
  }
}

// Run the seed function
seed();
