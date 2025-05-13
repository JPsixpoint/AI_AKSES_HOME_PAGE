import type { Express } from "express";
import { createServer, type Server } from "http";
import { db, pool } from "@db";
import { deals, insertDealSchema, sixpointDeals } from "@shared/schema";
import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import OpenAI from "openai";
import { Resend } from "resend";
import { heygenController } from "./heygen";
import { elevenLabsController } from "./elevenlabs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "mock_key_for_development",
  });
  
  // Set up Resend client (if API key is available)
  let resend: Resend | null = null;
  if (process.env.RESEND_API_KEY) {
    try {
      resend = new Resend(process.env.RESEND_API_KEY);
      console.log("Resend client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Resend client:", error);
    }
  } else {
    console.log("No RESEND_API_KEY found in environment, email features will be disabled");
  }

  // API Routes
  const apiPrefix = "/api";

  // HeyGen Avatar token endpoint
  app.get(`${apiPrefix}/heygen/token`, heygenController.getToken);
  
  // ElevenLabs endpoints
  app.post(`${apiPrefix}/elevenlabs/text-to-speech`, elevenLabsController.generateSpeech);
  app.get(`${apiPrefix}/elevenlabs/voices`, elevenLabsController.getVoices);

  // AI Chat route
  app.post(`${apiPrefix}/ai/chat`, async (req, res) => {
    try {
      const { messages, model } = req.body;
      
      console.log("Received AI chat request with model:", model);
      
      if (!messages || !Array.isArray(messages)) {
        console.error("Invalid messages format:", req.body);
        return res.status(400).json({ 
          message: "Invalid messages format",
          choices: [{ 
            message: { 
              content: "I encountered an error processing your request. Invalid message format.",
              role: "assistant" 
            },
            finish_reason: "stop"
          }]
        });
      }
      
      // Log OpenAI key status without exposing the key
      const hasValidAPIKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "mock_key_for_development";
      console.log("OpenAI API key available:", hasValidAPIKey);
      
      // For development or missing API key, return a useful response
      if (!hasValidAPIKey) {
        console.log("Using mock response due to missing API key");
        return res.status(200).json({
          id: "mock-response-id",
          choices: [
            {
              message: {
                content: "This is a mock response from the AI. An OpenAI API key is required.",
                role: "assistant",
              },
              finish_reason: "stop",
            },
          ],
        });
      }
      
      console.log("Sending request to OpenAI:", { model: model || "gpt-4o", messageCount: messages.length });
      
      const response = await openai.chat.completions.create({
        model: model || "gpt-4o",
        messages,
        temperature: 0.7,
      });
      
      console.log("Received response from OpenAI:", { 
        id: response.id,
        model: response.model,
        contentLength: response.choices[0]?.message?.content?.length || 0
      });
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error processing AI chat request:", error);
      
      // Create a well-formed error response that the client can handle
      return res.status(200).json({
        id: "error-response",
        choices: [
          {
            message: {
              content: "I'm sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.",
              role: "assistant",
            },
            finish_reason: "stop",
          },
        ],
      });
    }
  });

  // Deals CRUD routes
  
  // Get deal statistics from akses_deals - must be before :id route
  app.get(`${apiPrefix}/deals/statistics`, async (req, res) => {
    try {
      // Import necessary database functions
      const { pool, sqliteDbOperations, usingSqliteFallback } = await import('@db');
      
      // If using SQLite fallback, return SQLite statistics
      if (usingSqliteFallback) {
        const sqliteStats = sqliteDbOperations.getStatistics();
        return res.status(200).json(sqliteStats);
      }
      
      // Using PostgreSQL - get statistics directly
      try {
        console.log("Connected to PostgreSQL database");
        
        // Get total count
        const totalResult = await pool.query('SELECT COUNT(*) as count FROM akses_deals');
        const totalDeals = parseInt(totalResult.rows[0]?.count || '0');
        
        // Get stage counts
        const stageResult = await pool.query('SELECT stage, COUNT(*) as count FROM akses_deals GROUP BY stage');
        const stageStats = stageResult.rows.reduce((acc: Record<string, number>, row: any) => {
          acc[row.stage || 'Unknown'] = parseInt(row.count);
          return acc;
        }, {});
        
        // Get credit hub counts
        const creditHubResult = await pool.query('SELECT credit_hub, COUNT(*) as count FROM akses_deals GROUP BY credit_hub');
        const creditHubStats = creditHubResult.rows.reduce((acc: Record<string, number>, row: any) => {
          acc[row.credit_hub || 'Unknown'] = parseInt(row.count);
          return acc;
        }, {});
        
        // Get counts for specific stages we're interested in
        const dueDiligenceCount = stageStats['Due Diligence & U/W'] || 0;
        const prescreeningCount = stageStats['Pre-Screening'] || 0;
        const leadCount = stageStats['Lead'] || 0;
        const closedCount = (stageStats['Closed - Won'] || 0) + (stageStats['Closed - Lost'] || 0);
        
        // Static statistic changes for demonstration
        const valueChangePercent = 12;
        const newDealsThisMonth = 3;
        const dueDiligenceChangeWeekly = 0;
        const completedThisQuarter = 2;
        
        return res.status(200).json({
          totalDeals,
          stageStats,
          creditHubStats,
          dueDiligenceCount,
          prescreeningCount,
          leadCount,
          closedCount,
          valueChangePercent,
          newDealsThisMonth,
          dueDiligenceChangeWeekly,
          completedThisQuarter
        });
      } catch (pgError) {
        console.error("PostgreSQL error:", pgError);
        
        // Fall back to SQLite statistics
        const sqliteStats = sqliteDbOperations.getStatistics();
        return res.status(200).json(sqliteStats);
      }
    } catch (error) {
      console.error("Error fetching deal statistics:", error);
      return res.status(500).json({ 
        error: "Database error", 
        message: "Could not fetch deal statistics from the database. Please try again later." 
      });
    }
  });
  
  // Get all deals from the akses_deals table
  app.get(`${apiPrefix}/deals`, async (req, res) => {
    try {
      console.log("Fetching deals with query params:", req.query);
      
      // Import necessary database functions
      const { pool, sqliteDbOperations, usingSqliteFallback } = await import('@db');
      
      // Extract query parameters for filtering
      const { stage, priority, creditHub, country, lead } = req.query;
      
      // If we're using SQLite fallback, use the SQLite logic
      if (usingSqliteFallback) {
        const allDeals = sqliteDbOperations.getAllDeals();
        
        // Apply filters if needed
        const filteredDeals = allDeals.filter((deal: any) => {
          if (stage && stage !== 'all' && deal.stage !== stage) return false;
          if (priority && priority !== 'all' && deal.priority !== priority) return false;
          if (creditHub && creditHub !== 'all' && deal.credit_hub !== creditHub) return false;
          if (country && country !== 'all' && deal.country !== country) return false;
          if (lead && deal.lead !== lead) return false;
          return true;
        });
        
        console.log(`Retrieved ${filteredDeals.length} deals from SQLite database`);
        return res.status(200).json(filteredDeals);
      }
      
      // Using PostgreSQL - build query
      try {
        console.log("Connected to PostgreSQL database");
        
        // Build PostgreSQL query
        let query = "SELECT * FROM akses_deals";
        let conditions = [];
        let params = [];
        let paramIndex = 1;
        
        if (stage && typeof stage === 'string' && stage !== 'all') {
          conditions.push(`stage = $${paramIndex}`);
          params.push(stage);
          paramIndex++;
        }
        
        if (priority && typeof priority === 'string' && priority !== 'all') {
          conditions.push(`priority = $${paramIndex}`);
          params.push(priority);
          paramIndex++;
        }
        
        if (creditHub && typeof creditHub === 'string' && creditHub !== 'all') {
          conditions.push(`credit_hub = $${paramIndex}`);
          params.push(creditHub);
          paramIndex++;
        }
        
        if (country && typeof country === 'string' && country !== 'all') {
          conditions.push(`country = $${paramIndex}`);
          params.push(country);
          paramIndex++;
        }
        
        if (lead && typeof lead === 'string') {
          conditions.push(`lead = $${paramIndex}`);
          params.push(lead);
          paramIndex++;
        }
        
        if (conditions.length > 0) {
          query += " WHERE " + conditions.join(" AND ");
        }
        
        // Add ordering
        query += " ORDER BY id DESC";
        
        console.log("Executing SQL query:", query, "with params:", params);
        
        // Execute direct PostgreSQL query
        const result = await pool.query(query, params);
        
        // Process the data to match our app's expected format
        const allDeals = result.rows.map(deal => {
          return {
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
            ai_screening: deal.ai_screening || [],
            // Add these fields to ensure compatibility with our app
            created_at: deal.created_at || new Date().toISOString(),
            updated_at: deal.updated_at || new Date().toISOString(),
          };
        });
        
        console.log(`Retrieved ${allDeals.length} deals from PostgreSQL database`);
        return res.status(200).json(allDeals);
      } catch (pgError) {
        console.error("PostgreSQL error:", pgError);
        
        // Fall back to SQLite
        const allDeals = sqliteDbOperations.getAllDeals();
        console.log(`Falling back to SQLite - retrieved ${allDeals.length} deals`);
        return res.status(200).json(allDeals);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
      return res.status(500).json({ 
        error: "Database error", 
        message: "Could not fetch deals from the database. Please try again later." 
      });
    }
  });
  
  // Get deal by ID from akses_deals
  app.get(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!id || id.trim() === '') {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      // Use raw SQL query with the pool directly
      const result = await pool.query('SELECT * FROM akses_deals WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      const deal = result.rows[0];
      return res.status(200).json(deal);
    } catch (error) {
      console.error(`Error fetching deal with ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        error: "Database error", 
        message: "Could not fetch deal details from the database. Please try again later."
      });
    }
  });
  
  // Create new deal (in akses_deals table)
  app.post(`${apiPrefix}/deals`, async (req, res) => {
    try {
      // Get the validated data from request body
      const { name, stage, priority, country, lead, creditHub } = req.body;
      
      // Generate a MongoDB-style ID (24 character hex string)
      const id = Array.from({ length: 24 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      // Prepare the deal object for insertion
      const dealData = {
        id,
        name: name || null,
        stage: stage || 'Pre-Screening',
        priority: priority || null,
        country: country || null,
        lead: lead || null,
        credit_hub: creditHub || null,
        updates: JSON.stringify([]),
        members: JSON.stringify([]),
        pre_screening: JSON.stringify({})
      };
      
      // Insert the new deal using raw SQL
      const fields = Object.keys(dealData).join(', ');
      const placeholders = Object.keys(dealData).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(dealData);
      
      const query = `INSERT INTO akses_deals (${fields}) VALUES (${placeholders}) RETURNING *`;
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Failed to create deal');
      }
      
      const newDeal = result.rows[0];
      return res.status(201).json(newDeal);
    } catch (error) {
      console.error("Error creating deal:", error);
      return res.status(500).json({ message: "Failed to create deal" });
    }
  });
  
  // Update deal (in akses_deals table)
  app.patch(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!id || id.trim() === '') {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      // Check if deal exists
      const checkResult = await pool.query('SELECT * FROM akses_deals WHERE id = $1', [id]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      // Get the existing deal
      const existingDeal = checkResult.rows[0];
      
      // Prepare update data
      const { name, stage, priority, country, lead, creditHub } = req.body;
      
      // Build the SET clause and values array for SQL update
      const updates: Record<string, any> = {};
      if (name !== undefined) updates.name = name;
      if (stage !== undefined) updates.stage = stage;
      if (priority !== undefined) updates.priority = priority;
      if (country !== undefined) updates.country = country;
      if (lead !== undefined) updates.lead = lead;
      if (creditHub !== undefined) updates.credit_hub = creditHub;
      
      // If no updates, return the existing deal
      if (Object.keys(updates).length === 0) {
        return res.status(200).json(existingDeal);
      }
      
      // Build the SQL query
      const setClauses = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
      const values = [id, ...Object.values(updates)];
      
      const query = `UPDATE akses_deals SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Failed to update deal');
      }
      
      const updatedDeal = result.rows[0];
      return res.status(200).json(updatedDeal);
    } catch (error) {
      console.error(`Error updating deal with ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to update deal" });
    }
  });
  
  // Delete deal (from pipeline table)
  app.delete(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!id || id.trim() === '') {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      // Check if deal exists
      const checkResult = await pool.query('SELECT * FROM akses_deals WHERE id = $1', [id]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      // Delete the deal
      await pool.query('DELETE FROM akses_deals WHERE id = $1', [id]);
      
      return res.status(204).send();
    } catch (error) {
      console.error(`Error deleting deal with ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to delete deal" });
    }
  });
  


  // Pre-Screening Endpoints
  
  // Send pre-screening email
  app.post(`${apiPrefix}/prescreening/send`, async (req, res) => {
    try {
      const { dealId, recipientEmails, additionalContext, emailContent } = req.body;
      
      if (!dealId || !recipientEmails || !Array.isArray(recipientEmails) || recipientEmails.length === 0) {
        return res.status(400).json({ message: "Missing required fields: dealId and recipientEmails" });
      }
      
      // Check if deal exists
      const checkResult = await pool.query('SELECT * FROM akses_deals WHERE id = $1', [dealId]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      // Get the deal
      const deal = checkResult.rows[0];
      
      // Create a new AI screening entry with the new format
      const currentTimestamp = new Date().toISOString();
      const screeningEntry = {
        timestamp: currentTimestamp,
        initiatingUser: "Admin", // In a real app, this would come from authentication
        recipientEmails,
        emailContent,
        additionalContext: additionalContext || "",
        status: "sending", // Will be updated to "sent" once emails are sent
        resendCount: 0, // Initialize resend count at 0 for new entries
        trackingData: [
          {
            type: "sent",
            timestamp: currentTimestamp,
            metadata: {
              initiatedBy: "Admin",
              email: recipientEmails.join(", ")
            }
          }
        ]
      };
      
      // Check if this is a resend to the same recipients
      if (deal.ai_screening) {
        try {
          const existingScreenings = JSON.parse(deal.ai_screening);
          if (Array.isArray(existingScreenings)) {
            // Check for existing entries with the same recipient emails
            const matchingScreenings = existingScreenings.filter(s => {
              // Compare recipient lists (check if they have the same emails regardless of order)
              const currentEmailList = recipientEmails || [];
              const existingEmailList = s.recipientEmails || [];
              
              // Convert to arrays for comparison since we have TypeScript compatibility issues with Set
              if (currentEmailList.length !== existingEmailList.length) {
                return false;
              }
              
              // Check if every email in current list exists in the existing list
              return currentEmailList.every((email: string) => 
                existingEmailList.some((existingEmail: string) => existingEmail === email)
              );
            });
            
            if (matchingScreenings.length > 0) {
              // This is a resend, set the resend count based on previous entries
              const resendCounts = matchingScreenings.map(s => typeof s.resendCount === 'number' ? s.resendCount : 0);
              const maxResendCount = resendCounts.length > 0 ? Math.max(...resendCounts) : 0;
              screeningEntry.resendCount = maxResendCount + 1;
              console.log(`This is a resend (${maxResendCount + 1}) to the same recipients`);
            }
          }
        } catch (e) {
          // If parsing fails, treat as a new screening
          console.error('Error parsing existing screenings:', e);
        }
      }
      
      // Get existing AI screening data or initialize empty array
      let aiScreeningData = [];
      if (deal.ai_screening) {
        try {
          aiScreeningData = JSON.parse(deal.ai_screening);
          if (!Array.isArray(aiScreeningData)) {
            aiScreeningData = [];
          }
        } catch (e) {
          aiScreeningData = [];
        }
      }
      
      // Add new screening entry
      aiScreeningData.push(screeningEntry);
      
      // Update the deal with new AI screening data
      const updateQuery = `UPDATE akses_deals SET ai_screening = $1 WHERE id = $2 RETURNING *`;
      const updateResult = await pool.query(updateQuery, [JSON.stringify(aiScreeningData), dealId]);
      
      if (updateResult.rows.length === 0) {
        throw new Error('Failed to update deal with pre-screening data');
      }
      
      const updatedDeal = updateResult.rows[0];
      
      // Use Resend to actually send the email (if available)
      try {
        console.log('Processing email request...');
        
        // Extract recipient emails and convert to string if needed
        const toEmails = recipientEmails.join(',');
        
        // Clean up email addresses to ensure they're valid
        const cleanedEmails = recipientEmails
          .filter(email => typeof email === 'string')
          .map(email => {
            // Extract just the email if it contains text like "send to xyz@example.com"
            const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
            const match = email.match(emailRegex);
            return match ? match[1] : email.trim();
          })
          .filter(email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email));
          
        if (cleanedEmails.length === 0) {
          throw new Error('No valid email addresses provided');
        }
        
        // Prepare email data
        const emailOptions = {
          from: 'Akses AI <info@rsvp.emfintechconference.com>',
          to: cleanedEmails,  // Send to actual recipients
          subject: `Pre-Screening Invitation: ${deal.name || 'Deal'}`,
          html: emailContent,
          text: emailContent.replace(/<[^>]*>/g, ''), // Strip HTML for plain text version
        };
        
        let emailResult;
        
        // Check if Resend client is available
        if (resend) {
          // Send email using Resend with the provided domain and email
          console.log('Sending email with Resend API:', {
            to: cleanedEmails,
            subject: emailOptions.subject,
          });
          
          emailResult = await resend.emails.send(emailOptions);
        } else {
          // Create mock result when Resend is not available
          console.log('Resend API not available - email would have been sent to:', {
            to: cleanedEmails,
            subject: emailOptions.subject,
          });
          
          emailResult = {
            id: `mock-email-${Date.now()}`,
            from: emailOptions.from,
            to: cleanedEmails,
            subject: emailOptions.subject
          };
        }
        
        console.log('Email sent successfully:', emailResult);
        
        // Update the screening entry status to sent
        const index = aiScreeningData.length - 1;
        aiScreeningData[index].status = 'sent';
        
        // No need to add another tracking entry as we already added one when creating the screening entry
        
        // Update the deal with the new status
        await pool.query(updateQuery, [JSON.stringify(aiScreeningData), dealId]);
        
        // Return success response with the email result
        return res.status(200).json({
          message: "Pre-screening email sent successfully",
          recipients: recipientEmails,
          dealId,
          dealName: deal.name,
          emailResult
        });
      } catch (emailError: any) {
        console.error('Error sending email with Resend:', emailError);
        
        // Update the screening entry status to error
        const index = aiScreeningData.length - 1;
        aiScreeningData[index].status = 'error';
        aiScreeningData[index].error = emailError?.message || 'Email sending failed';
        
        // Add an error entry to the trackingData array
        if (Array.isArray(aiScreeningData[index].trackingData)) {
          aiScreeningData[index].trackingData.push({
            type: "error",
            timestamp: new Date().toISOString(),
            metadata: {
              errorMessage: emailError?.message || 'Email sending failed',
              errorDetails: JSON.stringify(emailError)
            }
          });
        }
        
        // Update the deal with the error status
        await pool.query(updateQuery, [JSON.stringify(aiScreeningData), dealId]);
        
        // Return error response
        return res.status(500).json({
          message: "Failed to send pre-screening email",
          error: emailError?.message || 'Unknown error',
          dealId,
          dealName: deal.name
        });
      }
    } catch (error: any) {
      console.error("Error in pre-screening process:", error);
      return res.status(500).json({ message: "Failed to process pre-screening request", error: error?.message || 'Unknown error' });
    }
  });
  
  // Get pre-screening status for a deal
  app.get(`${apiPrefix}/prescreening/:dealId`, async (req, res) => {
    try {
      const dealId = req.params.dealId;
      
      if (!dealId || dealId.trim() === '') {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      // Check if deal exists
      const checkResult = await pool.query('SELECT * FROM akses_deals WHERE id = $1', [dealId]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      const deal = checkResult.rows[0];
      
      // Get AI screening data
      let aiScreeningData = [];
      if (deal.ai_screening) {
        try {
          aiScreeningData = JSON.parse(deal.ai_screening);
          if (!Array.isArray(aiScreeningData)) {
            aiScreeningData = [];
          }
        } catch (e) {
          aiScreeningData = [];
        }
      }
      
      return res.status(200).json(aiScreeningData);
    } catch (error) {
      console.error(`Error fetching pre-screening status for deal ID ${req.params.dealId}:`, error);
      return res.status(500).json({ message: "Failed to fetch pre-screening status" });
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
      
      // Use a direct SQL query to avoid type compatibility issues
      const [deal] = await db.select().from(sixpointDeals).where(sql`${sixpointDeals.id} = ${id}`);
      
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
