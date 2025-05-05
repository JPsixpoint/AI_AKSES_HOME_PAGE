import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { deals, insertDealSchema, sixpointDeals } from "@shared/schema";
import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "mock_key_for_development",
  });

  // API Routes
  const apiPrefix = "/api";

  // AI Chat route
  app.post(`${apiPrefix}/ai/chat`, async (req, res) => {
    try {
      const { messages, model } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Invalid messages format" });
      }
      
      // For development, can return mock responses if no API key
      if (process.env.OPENAI_API_KEY === "mock_key_for_development") {
        return res.status(200).json({
          id: "mock-response-id",
          choices: [
            {
              message: {
                content: "This is a mock response from the AI. In production, this would use the OpenAI API.",
                role: "assistant",
              },
              finish_reason: "stop",
            },
          ],
        });
      }
      
      const response = await openai.chat.completions.create({
        model: model || "gpt-4o",
        messages,
        temperature: 0.7,
      });
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error processing AI chat request:", error);
      return res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  // Deals CRUD routes
  
  // Get all deals
  app.get(`${apiPrefix}/deals`, async (req, res) => {
    try {
      const allDeals = await db.query.deals.findMany({
        orderBy: desc(deals.updatedAt),
      });
      
      return res.status(200).json(allDeals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      return res.status(500).json({ message: "Failed to fetch deals" });
    }
  });
  
  // Get deal by ID
  app.get(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      const deal = await db.query.deals.findFirst({
        where: eq(deals.id, id),
      });
      
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      return res.status(200).json(deal);
    } catch (error) {
      console.error(`Error fetching deal with ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to fetch deal" });
    }
  });
  
  // Create new deal
  app.post(`${apiPrefix}/deals`, async (req, res) => {
    try {
      const validatedData = insertDealSchema.parse(req.body);
      
      // Ensure we have a subSector value
      if (!validatedData.subSector) {
        validatedData.subSector = validatedData.sector;
      }
      
      const [newDeal] = await db.insert(deals).values({
        ...validatedData,
        updatedAt: new Date(),
      }).returning();
      
      return res.status(201).json(newDeal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      console.error("Error creating deal:", error);
      return res.status(500).json({ message: "Failed to create deal" });
    }
  });
  
  // Update deal
  app.patch(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      // Get existing deal
      const existingDeal = await db.query.deals.findFirst({
        where: eq(deals.id, id),
      });
      
      if (!existingDeal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      // Validate update data against schema omitting required fields
      // to allow partial updates
      const updateSchema = insertDealSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      
      // Update the deal
      const [updatedDeal] = await db.update(deals)
        .set({
          ...validatedData,
          updatedAt: new Date(),
        })
        .where(eq(deals.id, id))
        .returning();
      
      return res.status(200).json(updatedDeal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      console.error(`Error updating deal with ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to update deal" });
    }
  });
  
  // Delete deal
  app.delete(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      // Check if deal exists
      const existingDeal = await db.query.deals.findFirst({
        where: eq(deals.id, id),
      });
      
      if (!existingDeal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      // Delete the deal
      await db.delete(deals).where(eq(deals.id, id));
      
      return res.status(204).send();
    } catch (error) {
      console.error(`Error deleting deal with ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to delete deal" });
    }
  });
  
  // Get deal statistics
  app.get(`${apiPrefix}/deals/statistics`, async (req, res) => {
    try {
      const allDeals = await db.query.deals.findMany();
      
      // Calculate total deal value
      const totalDealValue = allDeals.reduce((sum, deal) => sum + deal.value, 0);
      
      // Count active deals
      const activeDealCount = allDeals.filter(deal => 
        deal.status !== "Closed" && deal.status !== "Declined"
      ).length;
      
      // Count deals in due diligence
      const dueDiligenceCount = allDeals.filter(deal => 
        deal.status === "Due Diligence"
      ).length;
      
      // Count completed deals
      const completedDealCount = allDeals.filter(deal => 
        deal.status === "Closed"
      ).length;
      
      // Mock statistic changes for demonstration
      const valueChangePercent = 12;
      const newDealsThisMonth = 3;
      const dueDiligenceChangeWeekly = 0;
      const completedThisQuarter = 2;
      
      return res.status(200).json({
        totalDealValue,
        activeDealCount,
        dueDiligenceCount,
        completedDealCount,
        valueChangePercent,
        newDealsThisMonth,
        dueDiligenceChangeWeekly,
        completedThisQuarter
      });
    } catch (error) {
      console.error("Error fetching deal statistics:", error);
      return res.status(500).json({ message: "Failed to fetch deal statistics" });
    }
  });

  // SixPoint Deals API Endpoints
  
  // Get sixpoint deals statistics - must come before the :id route
  app.get(`${apiPrefix}/sixpoint-deals/statistics`, async (req, res) => {
    try {
      const allDeals = await db.query.sixpointDeals.findMany();
      
      // Get unique stages to calculate counts
      const stages = new Set(allDeals.map(deal => deal.stage).filter(Boolean));
      const stageStats = {} as { [key: string]: number };
      
      stages.forEach(stage => {
        if (stage) {
          stageStats[stage] = allDeals.filter(deal => deal.stage === stage).length;
        }
      });
      
      // Get unique credit hubs
      const creditHubs = new Set(allDeals.map(deal => deal.creditHub).filter(Boolean));
      const creditHubStats = {} as { [key: string]: number };
      
      creditHubs.forEach(hub => {
        if (hub) {
          creditHubStats[hub] = allDeals.filter(deal => deal.creditHub === hub).length;
        }
      });
      
      // Get unique countries
      const countries = new Set(allDeals.map(deal => deal.country).filter(Boolean));
      const countryStats = {} as { [key: string]: number };
      
      countries.forEach(country => {
        if (country) {
          countryStats[country] = allDeals.filter(deal => deal.country === country).length;
        }
      });
      
      // Count deals by priority
      const priorityStats = {
        high: allDeals.filter(deal => deal.priority === 'high').length,
        medium: allDeals.filter(deal => deal.priority === 'medium').length,
        low: allDeals.filter(deal => deal.priority === 'low').length
      };
      
      // Count deals by lead
      const leads = new Set(allDeals.map(deal => deal.lead).filter(Boolean));
      const leadStats = {} as { [key: string]: number };
      
      leads.forEach(lead => {
        if (lead) {
          leadStats[lead] = allDeals.filter(deal => deal.lead === lead).length;
        }
      });
      
      return res.status(200).json({
        totalDeals: allDeals.length,
        stageStats,
        creditHubStats,
        countryStats,
        priorityStats,
        leadStats
      });
    } catch (error) {
      console.error("Error fetching SixPoint deal statistics:", error);
      return res.status(500).json({ message: "Failed to fetch SixPoint deal statistics" });
    }
  });
  
  // Get all sixpoint deals
  app.get(`${apiPrefix}/sixpoint-deals`, async (req, res) => {
    try {
      // Extract query parameters for filtering
      const { stage, priority, creditHub, country, lead } = req.query;
      
      // Build query filters
      let filters = [];
      
      if (stage && typeof stage === 'string') {
        filters.push(eq(sixpointDeals.stage, stage));
      }
      
      if (priority && typeof priority === 'string') {
        filters.push(eq(sixpointDeals.priority, priority));
      }
      
      if (creditHub && typeof creditHub === 'string') {
        filters.push(eq(sixpointDeals.creditHub, creditHub));
      }
      
      if (country && typeof country === 'string') {
        filters.push(eq(sixpointDeals.country, country));
      }
      
      if (lead && typeof lead === 'string') {
        filters.push(eq(sixpointDeals.lead, lead));
      }
      
      // Execute query with filters if any
      let deals;
      if (filters.length > 0) {
        deals = await db.query.sixpointDeals.findMany({
          where: and(...filters),
          orderBy: desc(sixpointDeals.createdAt)
        });
      } else {
        deals = await db.query.sixpointDeals.findMany({
          orderBy: desc(sixpointDeals.createdAt)
        });
      }
      
      return res.status(200).json(deals);
    } catch (error) {
      console.error("Error fetching SixPoint deals:", error);
      return res.status(500).json({ message: "Failed to fetch SixPoint deals" });
    }
  });
  
  // Get sixpoint deal by ID
  app.get(`${apiPrefix}/sixpoint-deals/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!id || id.trim() === '') {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      const deal = await db.query.sixpointDeals.findFirst({
        where: eq(sixpointDeals.id, id)
      });
      
      if (!deal) {
        return res.status(404).json({ message: "SixPoint deal not found" });
      }
      
      return res.status(200).json(deal);
    } catch (error) {
      console.error(`Error fetching SixPoint deal with ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to fetch SixPoint deal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
