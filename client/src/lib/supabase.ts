import { apiRequest } from "./queryClient";
import { Deal } from "@shared/schema";

// Deals API Functions
export async function fetchDeals(): Promise<Deal[]> {
  try {
    const response = await fetch('/api/deals');
    if (!response.ok) {
      throw new Error(`Failed to fetch deals: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
}

export async function fetchDealById(id: number): Promise<Deal> {
  try {
    const response = await fetch(`/api/deals/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch deal: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching deal with ID ${id}:`, error);
    throw error;
  }
}

export async function createDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> {
  try {
    const response = await apiRequest('POST', '/api/deals', deal);
    return await response.json();
  } catch (error) {
    console.error('Error creating deal:', error);
    throw error;
  }
}

export async function updateDeal(id: number, deal: Partial<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Deal> {
  try {
    const response = await apiRequest('PATCH', `/api/deals/${id}`, deal);
    return await response.json();
  } catch (error) {
    console.error(`Error updating deal with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteDeal(id: number): Promise<void> {
  try {
    await apiRequest('DELETE', `/api/deals/${id}`);
  } catch (error) {
    console.error(`Error deleting deal with ID ${id}:`, error);
    throw error;
  }
}

// Deal Statistics Functions
export async function fetchDealStatistics(): Promise<{
  totalDealValue: number;
  activeDealCount: number;
  dueDiligenceCount: number;
  completedDealCount: number;
  valueChangePercent: number;
  newDealsThisMonth: number;
  dueDiligenceChangeWeekly: number;
  completedThisQuarter: number;
}> {
  try {
    const response = await fetch('/api/deals/statistics');
    if (!response.ok) {
      throw new Error(`Failed to fetch deal statistics: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching deal statistics:', error);
    throw error;
  }
}
