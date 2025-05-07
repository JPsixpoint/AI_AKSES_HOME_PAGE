import { db, pool } from "./index";
import * as schema from "@shared/schema";
import { deals } from "@shared/schema";

async function seed() {
  try {
    // Seed sample deals
    const existingDeals = await db.query.deals.findMany({
      limit: 1
    });
    
    if (existingDeals.length === 0) {
      console.log("Seeding deals data...");
      
      // Create deals that match our pipeline table schema
      const dealsData = [
        {
          // Generate a MongoDB-style ID (24 character hex string)
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "Fintech Solutions Ltd.",
          priority: "high",
          country: "Southeast Asia",
          lead: "SixPoint Capital",
          credit_hub: "LATAM",
          stage: "Due Diligence & U/W",
          updates: [],
          members: [],
          pre_screening: {}, 
          ai_screening: [],
        },
        {
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "Pay Global Inc.",
          priority: "medium",
          country: "North America",
          lead: "SixPoint Capital",
          credit_hub: "EMENA",
          stage: "Due Diligence & U/W",
          updates: [],
          members: [],
          pre_screening: {},
          ai_screening: [],
        },
        {
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "Credit Access Partners",
          priority: "high",
          country: "Europe",
          lead: "Venture East",
          credit_hub: "EMENA",
          stage: "Due Diligence & U/W",
          updates: [],
          members: [],
          pre_screening: {},
          ai_screening: [],
        },
        {
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "Mobile Money Solutions",
          priority: "medium",
          country: "Africa",
          lead: "Africa Growth Fund",
          credit_hub: "SSA",
          stage: "Indicative Proposal",
          updates: [],
          members: [],
          pre_screening: {},
          ai_screening: [],
        },
        {
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "Crypto Payment Tech",
          priority: "low",
          country: "Global",
          lead: "Blockchain Ventures",
          credit_hub: "LATAM",
          stage: "Indicative Proposal",
          updates: [],
          members: [],
          pre_screening: {},
          ai_screening: [],
        },
        {
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "InsurTech Innovations",
          priority: "medium",
          country: "Asia Pacific",
          lead: "Tech Seeds Asia",
          credit_hub: "APAC",
          stage: "Pre-Screening",
          updates: [],
          members: [],
          pre_screening: {},
          ai_screening: [],
        },
        {
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "Remittance Connect",
          priority: "high",
          country: "Latin America",
          lead: "LatAm Ventures",
          credit_hub: "LATAM",
          stage: "Indicative Proposal",
          updates: [],
          members: [],
          pre_screening: {},
          ai_screening: [],
        },
        {
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "Wealth Management AI",
          priority: "medium",
          country: "North America",
          lead: "Future Finance VC",
          credit_hub: "EMENA",
          stage: "Pre-Screening",
          updates: [],
          members: [],
          pre_screening: {},
          ai_screening: [],
        },
        {
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "SME Lending Solutions",
          priority: "medium",
          country: "Europe",
          lead: "Growth Capital Partners",
          credit_hub: "EMENA",
          stage: "Pre-Screening",
          updates: [],
          members: [],
          pre_screening: {},
          ai_screening: [],
        },
        {
          id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          name: "Biometric Payments",
          priority: "low",
          country: "Middle East",
          lead: "SixPoint Capital",
          credit_hub: "EMENA",
          stage: "Indicative Proposal",
          updates: [],
          members: [],
          pre_screening: {},
          ai_screening: [],
        }      
      ];
      
      // Insert all deals using raw SQL to ensure compatibility with the database schema
      for (const deal of dealsData) {
        const fields = Object.keys(deal).join(', ');
        const placeholders = Object.keys(deal).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(deal);
        
        // Use string for arrays and objects
        const preparedValues = values.map(val => {
          if (Array.isArray(val) || (val !== null && typeof val === 'object')) {
            return JSON.stringify(val);
          }
          return val;
        });
        
        const query = `INSERT INTO pipeline (${fields}) VALUES (${placeholders})`;
        await pool.query(query, preparedValues);
      }
      
      console.log("Deals data seeded successfully!");
    } else {
      console.log("Deals data already exists, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
