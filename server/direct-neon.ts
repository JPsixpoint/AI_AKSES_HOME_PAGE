/**
 * Direct Neon Database Access
 * 
 * This module provides a direct serverless connection to the Neon database
 * as a fallback mechanism when the PostgreSQL connection fails.
 * 
 * Using @neondatabase/serverless to handle direct HTTP connections without requiring
 * a full PostgreSQL client, which is more reliable in serverless/Replit environments.
 */

import { Deal } from "@shared/schema";
import type { QueryResultRow } from "@neondatabase/serverless";

// Define the structure of a deal record from the Neon database
interface NeonDealRecord extends QueryResultRow {
  id: string;
  name: string;
  priority: string;
  country: string;
  lead: string;
  credit_hub: string;
  stage: string;
  updates: string | Record<string, any>;
  pre_screening: string | Record<string, any>;
  members: string | any[];
}

/**
 * This is the primary function that should be used in production to ensure
 * we always get real data from the Neon database.
 */
export async function getDealsDirectly(): Promise<Deal[]> {
  try {
    console.log("Attempting to fetch deals directly from Neon Serverless");
    
    // Use the @neondatabase/serverless package
    const { neon } = await import('@neondatabase/serverless');
    
    // Create a SQL function using the DATABASE_URL environment variable
    // We need the ! to tell TypeScript that we know this exists
    const sql = neon(process.env.DATABASE_URL!);
    
    // Execute the query through the Neon serverless driver
    const rows = await sql`
      SELECT * FROM akses_deals 
      ORDER BY id DESC 
      LIMIT 100
    ` as unknown as NeonDealRecord[];
    
    console.log(`Retrieved ${rows?.length || 0} deals directly from Neon Serverless`);
    
    // Transform the data to our expected format with normalized field names
    return rows.map(deal => {
      // Parse JSON strings if necessary
      const updates = typeof deal.updates === 'string' 
        ? JSON.parse(deal.updates) 
        : (deal.updates || {});
        
      const preScreening = typeof deal.pre_screening === 'string'
        ? JSON.parse(deal.pre_screening)
        : (deal.pre_screening || {});
        
      const members = Array.isArray(deal.members) 
        ? deal.members 
        : (typeof deal.members === 'string' ? JSON.parse(deal.members) : []);
      
      // Return a normalized deal object with both snake_case and camelCase fields
      return {
        id: deal.id,
        name: deal.name,
        priority: deal.priority,
        country: deal.country,
        lead: deal.lead,
        credit_hub: deal.credit_hub,  
        creditHub: deal.credit_hub,   
        stage: deal.stage,
        updates: updates,
        members: members,
        pre_screening: preScreening,
        preScreening: preScreening,
        ai_screening: [],
        aiScreening: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  } catch (error: any) {
    console.error("Error fetching deals directly from Neon:", error);
    
    // Check if this is an IP restriction error - common in deploys
    if (error && typeof error === 'object' && error.message) {
      if (error.message.includes('not allowed to connect') && error.message.includes('IP address')) {
        console.error('IP RESTRICTION ERROR: This deployment server IP is not allowed in your Neon database settings.');
        console.error('Add the Replit deployment IP to your Neon database allowed list in the Neon console.');
        console.error('The typical Replit IPv6 is something like 2600:1900:0:2d00::300');
      } else if (error.message.includes('endpoint is disabled')) {
        console.error('ENDPOINT DISABLED: Your Neon database endpoint appears to be disabled or suspended.');
        console.error('Check your Neon database console to ensure your endpoint is active.');
      }
    }
    
    return [];
  }
}

/**
 * Get deal statistics directly from Neon
 * This uses the serverless driver for better reliability in Replit
 */
export async function getDealsStatisticsDirectly() {
  try {
    console.log("Attempting to fetch deal statistics directly from Neon Serverless");
    
    // Import the neon serverless package
    const { neon } = await import('@neondatabase/serverless');
    
    // Create a SQL function using the DATABASE_URL environment variable
    const sql = neon(process.env.DATABASE_URL!);
    
    // Get total count of deals
    const countResult = await sql`SELECT COUNT(*) as count FROM akses_deals`;
    const totalDeals = parseInt(countResult[0]?.count || '0');
    
    // Get stage statistics
    const stageResult = await sql`SELECT stage, COUNT(*) as count FROM akses_deals GROUP BY stage`;
    const stageStats = stageResult.reduce((acc: Record<string, number>, row: any) => {
      acc[row.stage || 'Unknown'] = parseInt(row.count);
      return acc;
    }, {});
    
    // Get credit hub statistics
    const hubResult = await sql`SELECT credit_hub, COUNT(*) as count FROM akses_deals GROUP BY credit_hub`;
    const creditHubStats = hubResult.reduce((acc: Record<string, number>, row: any) => {
      acc[row.credit_hub || 'Unknown'] = parseInt(row.count);
      return acc;
    }, {});
    
    // Counts for specific stages
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
      // Static metrics for dashboard display
      valueChangePercent: 12,
      newDealsThisMonth: 3,
      dueDiligenceChangeWeekly: 0,
      completedThisQuarter: 2
    };
  } catch (error: any) {
    console.error("Error fetching deal statistics directly from Neon:", error);
    
    // Check if this is an IP restriction error - common in deploys
    if (error && typeof error === 'object' && error.message) {
      if (error.message.includes('not allowed to connect') && error.message.includes('IP address')) {
        console.error('IP RESTRICTION ERROR: This deployment server IP is not allowed in your Neon database settings.');
        console.error('Add the Replit deployment IP to your Neon database allowed list in the Neon console.');
        console.error('The typical Replit IPv6 is something like 2600:1900:0:2d00::300');
      } else if (error.message.includes('endpoint is disabled')) {
        console.error('ENDPOINT DISABLED: Your Neon database endpoint appears to be disabled or suspended.');
        console.error('Check your Neon database console to ensure your endpoint is active.');
      }
    }
    
    return null;
  }
}