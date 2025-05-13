/**
 * Export Deals to SQLite Format
 * 
 * This script exports deals data from the PostgreSQL database to a SQLite-friendly
 * JSON format that can be easily imported. This helps ensure our fallback data
 * is complete and properly formatted.
 */
import fs from 'fs';
import path from 'path';
import { verifyDatabaseConnection } from '../db';
import { sqliteDb, sqliteDeals } from '../db/sqlite';
import { executeQuery } from '../db';

interface DealRecord {
  id: string;
  name: string;
  priority: string | null;
  country: string | null;
  lead: string | null;
  credit_hub: string | null;
  stage: string | null;
  updates: string;
  pre_screening: string;
  members: string;
  ai_screening?: string;
}

async function exportDeals() {
  try {
    console.log('Starting to export deals from PostgreSQL to SQLite-compatible format');
    
    // First verify PostgreSQL connection
    const isConnected = await verifyDatabaseConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to PostgreSQL database');
    }
    
    // Fetch all deals from PostgreSQL
    const deals = await executeQuery('SELECT * FROM akses_deals ORDER BY id DESC');
    console.log(`Retrieved ${deals.length} deals from PostgreSQL`);
    
    if (deals.length === 0) {
      console.log('No deals found in the database, nothing to export');
      return;
    }
    
    // Format them for SQLite
    const sqliteDeals: DealRecord[] = deals.map(deal => {
      // Format the updates field safely
      let updates = '[]';
      if (deal.updates) {
        if (typeof deal.updates === 'string') {
          updates = deal.updates;
        } else if (typeof deal.updates === 'object') {
          updates = JSON.stringify(deal.updates);
        }
      }
      
      // Format the pre_screening field safely
      let preScreening = '{}';
      if (deal.pre_screening) {
        if (typeof deal.pre_screening === 'string') {
          preScreening = deal.pre_screening;
        } else if (typeof deal.pre_screening === 'object') {
          preScreening = JSON.stringify(deal.pre_screening);
        }
      }
      
      // Format the members field safely
      let members = '[]';
      if (deal.members) {
        if (typeof deal.members === 'string') {
          members = deal.members;
        } else if (Array.isArray(deal.members)) {
          members = JSON.stringify(deal.members);
        }
      }
      
      // Format ai_screening
      let aiScreening = '[]';
      if (deal.ai_screening) {
        if (typeof deal.ai_screening === 'string') {
          aiScreening = deal.ai_screening;
        } else if (Array.isArray(deal.ai_screening)) {
          aiScreening = JSON.stringify(deal.ai_screening);
        }
      }
      
      return {
        id: deal.id,
        name: deal.name || 'Unknown Deal',
        priority: deal.priority,
        country: deal.country,
        lead: deal.lead,
        credit_hub: deal.credit_hub,
        stage: deal.stage,
        updates,
        pre_screening: preScreening,
        members,
        ai_screening: aiScreening,
      };
    });
    
    // Save to a JSON file that can be loaded by SQLite fallback
    const exportPath = path.join(process.cwd(), 'attached_assets', 'deals-sqlite.json');
    fs.writeFileSync(exportPath, JSON.stringify(sqliteDeals, null, 2));
    console.log(`Exported ${sqliteDeals.length} deals to ${exportPath}`);
    
    // Also save a backup of the CSV
    const backupPath = path.join(process.cwd(), 'attached_assets', 'deals.csv.backup');
    const csvPath = path.join(process.cwd(), 'attached_assets', 'deals.csv');
    
    if (fs.existsSync(csvPath)) {
      fs.copyFileSync(csvPath, backupPath);
      console.log(`Created backup of deals.csv at ${backupPath}`);
    }
    
    console.log('Export completed successfully');
  } catch (error) {
    console.error('Error exporting deals:', error);
  }
}

// Execute the export
exportDeals();