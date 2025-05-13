/**
 * Direct Neon Database Access
 * 
 * This module provides a direct HTTP fetch-based connection to the Neon database
 * as a fallback mechanism when the PostgreSQL connection fails.
 * 
 * Neon provides a HTTP API that can be used to execute SQL queries directly.
 */

import { Deal } from "@shared/schema";

// IMPORTANT: Use the exact Neon database information
const NEON_PROJECT_ID = "ep-white-breeze-a5zu57ak"; // Extract from URL
const NEON_DATABASE = "scale";
const NEON_USER = "scale_owner";
const NEON_PASSWORD = "uMLhi5Va0Sdx";
const NEON_HOST = "ep-white-breeze-a5zu57ak-pooler.us-east-2.aws.neon.tech";

interface NeonDeal {
  id: string;
  name: string;
  priority: string;
  country: string;
  lead: string;
  credit_hub: string;
  stage: string;
  updates: any;
  pre_screening: any;
  members: any;
}

// Function to get deals directly from Neon via HTTP
export async function getDealsDirectly(): Promise<Deal[]> {
  try {
    console.log("Attempting to fetch deals directly from Neon via HTTP");
    
    // Build the connection URL
    const url = `https://${NEON_HOST}/sql`;
    
    // Execute a query to get data from Neon
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${NEON_USER}:${NEON_PASSWORD}`).toString('base64')}`
      },
      body: JSON.stringify({
        query: "SELECT * FROM akses_deals ORDER BY id DESC LIMIT 100"
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Neon: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data.rows?.length || 0} deals directly from Neon via HTTP`);
    
    // Transform data to our expected format
    return (data.rows || []).map((deal: NeonDeal) => ({
      id: deal.id,
      name: deal.name,
      priority: deal.priority,
      country: deal.country,
      lead: deal.lead,
      credit_hub: deal.credit_hub,
      stage: deal.stage,
      updates: typeof deal.updates === 'string' ? JSON.parse(deal.updates) : deal.updates,
      members: Array.isArray(deal.members) ? deal.members : [],
      pre_screening: typeof deal.pre_screening === 'string' ? JSON.parse(deal.pre_screening) : deal.pre_screening || {},
      ai_screening: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching deals directly from Neon:", error);
    return [];
  }
}

// Function to get deals statistics
export async function getDealsStatisticsDirectly() {
  try {
    console.log("Attempting to fetch deal statistics directly from Neon via HTTP");
    
    // Build the connection URL
    const url = `https://${NEON_HOST}/sql`;
    
    // Execute a query to get total count
    const countResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${NEON_USER}:${NEON_PASSWORD}`).toString('base64')}`
      },
      body: JSON.stringify({
        query: "SELECT COUNT(*) as count FROM akses_deals"
      })
    });
    
    if (!countResponse.ok) {
      throw new Error(`Failed to fetch from Neon: ${countResponse.status} ${countResponse.statusText}`);
    }
    
    const countData = await countResponse.json();
    const totalDeals = parseInt(countData.rows[0]?.count || '0');
    
    // Get stage statistics
    const stageResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${NEON_USER}:${NEON_PASSWORD}`).toString('base64')}`
      },
      body: JSON.stringify({
        query: "SELECT stage, COUNT(*) as count FROM akses_deals GROUP BY stage"
      })
    });
    
    const stageData = await stageResponse.json();
    const stageStats = (stageData.rows || []).reduce((acc: Record<string, number>, row: any) => {
      acc[row.stage || 'Unknown'] = parseInt(row.count);
      return acc;
    }, {});
    
    // Get credit hub statistics
    const hubResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${NEON_USER}:${NEON_PASSWORD}`).toString('base64')}`
      },
      body: JSON.stringify({
        query: "SELECT credit_hub, COUNT(*) as count FROM akses_deals GROUP BY credit_hub"
      })
    });
    
    const hubData = await hubResponse.json();
    const creditHubStats = (hubData.rows || []).reduce((acc: Record<string, number>, row: any) => {
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
      // Static metrics
      valueChangePercent: 12,
      newDealsThisMonth: 3,
      dueDiligenceChangeWeekly: 0,
      completedThisQuarter: 2
    };
  } catch (error) {
    console.error("Error fetching deal statistics directly from Neon:", error);
    return null;
  }
}