import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { db, pool } from "@db";
import { deals, insertDealSchema, sixpointDeals, users, permissionGroups, userPermissionGroups, insertPermissionGroupSchema } from "@shared/schema";
import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import OpenAI from "openai";
import passport from './auth';
import { registerUser, generateResetToken, isAuthenticated } from './auth';
import { sendWelcomeEmail, sendLoginNotificationEmail, sendPasswordResetEmail, sendEmail } from './services/email';
import crypto from 'crypto';

// Middleware to check if user is an admin
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const user = req.user as any;
  if (!user.is_admin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  
  next();
};
import { Resend } from "resend";
import { heygenController } from "./heygen";
export async function registerRoutes(app: Express): Promise<Server> {
  // Set up OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "mock_key_for_development",
  });
  
  // Set up Resend client
  const resend = new Resend(process.env.RESEND_API_KEY);

  // TEMPORARY: Backdoor route to make a user an admin (REMOVE AFTER TESTING)
  app.get('/make-admin/:username', async (req, res) => {
    try {
      const username = req.params.username;
      
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
      
      const result = await db.update(users)
        .set({ is_admin: true })
        .where(eq(users.username, username))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: `User ${username} is now an admin`, user: result[0] });
    } catch (error) {
      console.error('Error making user admin:', error);
      res.status(500).json({ message: 'Failed to make user an admin' });
    }
  });

  // Test page for API
  app.get('/test-api', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Test</title>
    </head>
    <body>
      <h1>Permission Groups API Test</h1>
      <button id="fetchButton">Fetch Permission Groups</button>
      <pre id="result" style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;"></pre>

      <script>
        document.getElementById('fetchButton').addEventListener('click', async () => {
          const resultElement = document.getElementById('result');
          resultElement.textContent = 'Loading...';
          
          try {
            const response = await fetch('/api/permission-groups', {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            resultElement.textContent = \`Status: \${response.status}\\n\`;
            
            if (!response.ok) {
              if (response.status === 401) {
                resultElement.textContent += 'Error: You must be logged in to access permission groups\\n';
              } else if (response.status === 403) {
                resultElement.textContent += 'Error: You do not have permission to access permission groups\\n';
              } else {
                resultElement.textContent += 'Error: Failed to fetch permission groups\\n';
              }
              
              try {
                const errorData = await response.text();
                resultElement.textContent += \`Response: \${errorData}\\n\`;
              } catch (e) {
                resultElement.textContent += \`Could not parse response: \${e.message}\\n\`;
              }
            } else {
              const data = await response.json();
              resultElement.textContent += \`Response: \${JSON.stringify(data, null, 2)}\\n\`;
            }
          } catch (err) {
            resultElement.textContent = \`Error: \${err.message}\`;
            console.error('Error:', err);
          }
        });
      </script>
    </body>
    </html>
    `);
  });

  // API Routes
  const apiPrefix = "/api";
  // Authentication routes
  app.post(`${apiPrefix}/auth/login`, (req, res, next) => {
    // First, check if credentials were provided
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    passport.authenticate('local', (err: any, user: any, info: { message?: string }) => {
      if (err) {
        return res.status(500).json({ message: 'An error occurred during login' });
      }
      
      if (!user) {
        // Authentication failed
        return res.status(401).json({ message: info?.message || 'Invalid username or password' });
      }
      
      // Log the user in
      req.logIn(user, async (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'An error occurred during login' });
        }
        
        try {
          // Update last_login timestamp
          await db.update(users)
            .set({ last_login: new Date() })
            .where(eq(users.id, user.id));
          
          // Send user information (excluding password)
          const { password, ...userWithoutPassword } = user;
          
          // Send login notification email asynchronously
          sendLoginNotificationEmail(user.username, user.display_name || user.username)
            .catch(err => console.error('Failed to send login notification email:', err));
          
          return res.json({ 
            user: userWithoutPassword,
            message: 'Logged in successfully' 
          });
        } catch (error) {
          console.error('Error in login route:', error);
          return res.status(500).json({ message: 'An error occurred during login' });
        }
      });
    })(req, res, next);
  });

  // Microsoft OAuth routes
  app.get(
    `${apiPrefix}/auth/microsoft`,
    passport.authenticate('microsoft', { prompt: 'select_account' })
  );

  app.get(
    `${apiPrefix}/auth/microsoft/callback`,
    passport.authenticate('microsoft', { 
      failureRedirect: '/login',
      keepSessionInfo: true 
    }),
    async (req, res) => {
      try {
        // Update last_login timestamp
        const user = req.user as any;
        await db.update(users)
          .set({ last_login: new Date() })
          .where(eq(users.id, user.id));
          
        // Send login notification email asynchronously
        sendLoginNotificationEmail(user.username, user.display_name || user.username)
          .catch(err => console.error('Failed to send login notification email:', err));
          
        // Successful authentication, redirect home
        res.redirect('/');
      } catch (error) {
        console.error('Error in Microsoft OAuth callback:', error);
        res.redirect('/login?error=auth_error');
      }
    }
  );

  app.post(`${apiPrefix}/auth/logout`, (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.post(`${apiPrefix}/auth/register`, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await registerUser(username, password);
      
      // Send welcome email asynchronously 
      sendWelcomeEmail(username, user.display_name || username)
        .catch(err => console.error('Failed to send welcome email:', err));
      
      res.status(201).json({ 
        message: 'User registered successfully',
        user: { id: user.id, username: user.username }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error registering user' });
    }
  });

  app.post(`${apiPrefix}/auth/forgot-password`, async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
      
      const token = await generateResetToken(username);
      
      if (!token) {
        // Don't reveal that the user doesn't exist
        return res.json({ message: 'If that account exists, we sent a password reset email' });
      }
      
      // Send password reset email
      try {
        // Get user display name if available
        const userResults = await db.select().from(users).where(eq(users.username, username));
        const displayName = userResults.length > 0 ? (userResults[0].display_name || username) : username;
        
        await sendPasswordResetEmail(username, displayName, token);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Continue the flow even if email fails
      }
      
      res.json({ 
        message: 'If that account exists, we sent a password reset email',
        // In a real application, don't include the token in the response
        // This is just for demonstration purposes
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Error processing request' });
    }
  });
  
  app.post(`${apiPrefix}/auth/reset-password`, async (req, res) => {
    try {
      const { token, username, password } = req.body;
      
      if (!token || !username || !password) {
        return res.status(400).json({ message: 'Token, username, and password are required' });
      }
      
      // In a real application, you would validate the token
      // For now, we'll just pretend it's valid
      
      // Find the user
      const userResults = await db.select().from(users).where(eq(users.username, username));
      
      if (userResults.length === 0) {
        return res.status(400).json({ message: 'Invalid token or username' });
      }
      
      // Generate a new salt
      const salt = crypto.randomBytes(16).toString('hex');
      // Hash the new password with the salt
      const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
      // Store the password with salt
      const passwordWithSalt = `${hashedPassword}:${salt}`;
      
      // Update the user's password
      await db.update(users)
        .set({ password: passwordWithSalt })
        .where(eq(users.username, username));
      
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Error processing request' });
    }
  });
  
  app.get(`${apiPrefix}/auth/check`, async (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      
      // Update last_login timestamp
      await db.update(users)
        .set({ last_login: new Date() })
        .where(eq(users.id, user.id));
      
      console.log(`Last login updated for user ${user.username} at ${new Date().toISOString()}`);
      
      const { password, ...userWithoutPassword } = user;
      return res.json({ 
        authenticated: true,
        user: userWithoutPassword
      });
    }
    res.json({ authenticated: false });
  });
  // HeyGen Avatar token endpoint
  app.get(`${apiPrefix}/heygen/token`, heygenController.getToken);

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
  
  // Get deal statistics (from pipeline table) - must be before :id route
  app.get(`${apiPrefix}/deals/statistics`, async (req, res) => {
    try {
      // Using raw SQL to get statistics from pipeline table
      const totalResult = await pool.query('SELECT COUNT(*) as count FROM pipeline');
      const totalDeals = parseInt(totalResult.rows[0].count);
      
      // Get stage counts
      const stageResult = await pool.query(`
        SELECT stage, COUNT(*) as count 
        FROM pipeline 
        GROUP BY stage
      `);
      
      const stageStats = stageResult.rows.reduce((acc, row) => {
        acc[row.stage || 'Unknown'] = parseInt(row.count);
        return acc;
      }, {});
      
      // Get credit hub counts
      const creditHubResult = await pool.query(`
        SELECT credit_hub, COUNT(*) as count 
        FROM pipeline 
        GROUP BY credit_hub
      `);
      
      const creditHubStats = creditHubResult.rows.reduce((acc, row) => {
        acc[row.credit_hub || 'Unknown'] = parseInt(row.count);
        return acc;
      }, {});
      
      // Get counts for specific stages we're interested in
      const dueDiligenceCount = stageStats['Due Diligence & U/W'] || 0;
      const prescreeningCount = stageStats['Pre-Screening'] || 0;
      const leadCount = stageStats['Lead'] || 0;
      const closedCount = (stageStats['Closed - Won'] || 0) + (stageStats['Closed - Lost'] || 0);
      
      // Mock statistic changes for demonstration
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
    } catch (error) {
      console.error("Error fetching deal statistics:", error);
      return res.status(500).json({ message: "Failed to fetch deal statistics" });
    }
  });
  
  // Get all deals (from pipeline table)
  app.get(`${apiPrefix}/deals`, async (req, res) => {
    try {
      // Extract query parameters for filtering
      const { stage, priority, creditHub, country, lead } = req.query;
      
      // Build query with filters
      let query = "SELECT * FROM pipeline";
      let conditions = [];
      let params = [];
      let paramIndex = 1;
      
      if (stage && typeof stage === 'string') {
        conditions.push(`stage = $${paramIndex}`);
        params.push(stage);
        paramIndex++;
      }
      
      if (priority && typeof priority === 'string') {
        conditions.push(`priority = $${paramIndex}`);
        params.push(priority);
        paramIndex++;
      }
      
      if (creditHub && typeof creditHub === 'string') {
        conditions.push(`credit_hub = $${paramIndex}`);
        params.push(creditHub);
        paramIndex++;
      }
      
      if (country && typeof country === 'string') {
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
      
      // Execute query
      const result = await pool.query(query, params);
      const allDeals = result.rows;
      
      return res.status(200).json(allDeals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      return res.status(500).json({ message: "Failed to fetch deals" });
    }
  });
  
  // Get deal by ID (from pipeline table)
  app.get(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!id || id.trim() === '') {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      // Use raw SQL query with the pool directly
      const result = await pool.query('SELECT * FROM pipeline WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      const deal = result.rows[0];
      return res.status(200).json(deal);
    } catch (error) {
      console.error(`Error fetching deal with ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to fetch deal" });
    }
  });
  
  // Create new deal (in pipeline table)
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
      
      const query = `INSERT INTO pipeline (${fields}) VALUES (${placeholders}) RETURNING *`;
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
  
  // Update deal (in pipeline table)
  app.patch(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!id || id.trim() === '') {
        return res.status(400).json({ message: "Invalid deal ID" });
      }
      
      // Check if deal exists
      const checkResult = await pool.query('SELECT * FROM pipeline WHERE id = $1', [id]);
      
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
      
      const query = `UPDATE pipeline SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`;
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
      const checkResult = await pool.query('SELECT * FROM pipeline WHERE id = $1', [id]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      // Delete the deal
      await pool.query('DELETE FROM pipeline WHERE id = $1', [id]);
      
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
      const checkResult = await pool.query('SELECT * FROM pipeline WHERE id = $1', [dealId]);
      
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
      const updateQuery = `UPDATE pipeline SET ai_screening = $1 WHERE id = $2 RETURNING *`;
      const updateResult = await pool.query(updateQuery, [JSON.stringify(aiScreeningData), dealId]);
      
      if (updateResult.rows.length === 0) {
        throw new Error('Failed to update deal with pre-screening data');
      }
      
      const updatedDeal = updateResult.rows[0];
      
      // Use Resend to actually send the email
      try {
        console.log('Sending email using Resend API...');
        
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
        
        // Send email using Resend with the provided domain and email
        console.log('Attempting to send email with Resend API:', {
          from: 'Akses AI <info@rsvp.emfintechconference.com>',
          to: cleanedEmails,
          subject: `Pre-Screening Invitation: ${deal.name || 'Deal'}`,
        });
        
        const emailResult = await resend.emails.send({
          from: 'Akses AI <info@rsvp.emfintechconference.com>',
          to: cleanedEmails,  // Send to actual recipients
          subject: `Pre-Screening Invitation: ${deal.name || 'Deal'}`,
          html: emailContent,
          text: emailContent.replace(/<[^>]*>/g, ''), // Strip HTML for plain text version
        });
        
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
      const checkResult = await pool.query('SELECT * FROM pipeline WHERE id = $1', [dealId]);
      
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

  // User Management Routes (Admin only)
  app.get(`${apiPrefix}/users`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Get all users
      const userResults = await db.select().from(users);
      
      // Get all user-permission group mappings
      const userGroupMappings = await db.select().from(userPermissionGroups);
      
      // Create a mapping of user_id to group_ids
      const userGroupMap = new Map();
      userGroupMappings.forEach(mapping => {
        if (!userGroupMap.has(mapping.user_id)) {
          userGroupMap.set(mapping.user_id, []);
        }
        userGroupMap.get(mapping.user_id).push(mapping.group_id);
      });
      
      // Combine user data with permission groups
      const usersWithGroups = userResults.map(user => {
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          permission_groups: userGroupMap.get(user.id) || []
        };
      });
      
      res.json(usersWithGroups);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });
  
  app.get(`${apiPrefix}/users/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const userResult = await db.select().from(users).where(eq(users.id, userId));
      
      if (userResult.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const user = userResult[0];
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });
  
  app.post(`${apiPrefix}/users`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { username, password, display_name, is_admin, permissions } = req.body;
      
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
      
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.username, username));
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      let userData: any = {
        username,
        display_name,
        is_admin: is_admin || false,
        permissions: permissions || []
      };
      
      // If password is provided, hash it
      if (password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
        userData.password = `${hashedPassword}:${salt}`;
      }
      
      const result = await db.insert(users).values(userData).returning();
      
      // Don't return password
      const { password: _, ...newUser } = result[0];
      
      // Send welcome email asynchronously
      sendWelcomeEmail(username, display_name || username)
        .catch(err => console.error('Failed to send welcome email:', err));
      
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });
  
  app.put(`${apiPrefix}/users/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const { username, password, display_name, is_admin, permissions, permission_group_id } = req.body;
      
      // Check if user exists
      const userResult = await db.select().from(users).where(eq(users.id, userId));
      if (userResult.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // If changing username, check if new username already exists
      if (username && username !== userResult[0].username) {
        const existingUser = await db.select().from(users).where(eq(users.username, username));
        if (existingUser.length > 0) {
          return res.status(400).json({ message: 'Username already exists' });
        }
      }
      
      let userData: any = {};
      
      if (username) userData.username = username;
      if (display_name !== undefined) userData.display_name = display_name;
      if (is_admin !== undefined) userData.is_admin = is_admin;
      if (permissions !== undefined) userData.permissions = permissions;
      
      // If password is provided, hash it
      if (password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
        userData.password = `${hashedPassword}:${salt}`;
      }
      
      if (Object.keys(userData).length === 0 && permission_group_id === undefined) {
        return res.status(400).json({ message: 'No data provided for update' });
      }
      
      // Update user data
      const result = await db.update(users)
        .set(userData)
        .where(eq(users.id, userId))
        .returning();
      
      // Handle permission group assignment
      if (permission_group_id !== undefined) {
        // First, remove all existing group associations
        await db.delete(userPermissionGroups).where(eq(userPermissionGroups.user_id, userId));
        
        // If a new group is specified, add it
        if (permission_group_id) {
          const groupId = parseInt(permission_group_id);
          
          // Verify the group exists
          const groupExists = await db.select().from(permissionGroups).where(eq(permissionGroups.id, groupId));
          if (groupExists.length === 0) {
            return res.status(400).json({ message: 'Permission group not found' });
          }
          
          // Add user to group
          await db.insert(userPermissionGroups).values({
            user_id: userId,
            group_id: groupId
          });
          
          // Optionally update user permissions to match group
          if (groupExists[0].permissions) {
            await db.update(users)
              .set({ permissions: groupExists[0].permissions })
              .where(eq(users.id, userId));
          }
        }
      }
      
      // Get updated user with permission groups
      const userGroups = await db
        .select({ group_id: userPermissionGroups.group_id })
        .from(userPermissionGroups)
        .where(eq(userPermissionGroups.user_id, userId));
      
      const groupIds = userGroups.map(ug => ug.group_id);
      
      // Don't return password
      const { password: _, ...updatedUser } = result[0];
      
      res.json({
        ...updatedUser,
        permission_groups: groupIds
      });
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ message: 'Failed to update user' });
    }
  });
  
  app.delete(`${apiPrefix}/users/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      // Don't allow deleting current user
      if (req.user && (req.user as any).id === userId) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }
      
      // Check if user exists
      const userResult = await db.select().from(users).where(eq(users.id, userId));
      if (userResult.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      await db.delete(users).where(eq(users.id, userId));
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });
  
  // Invite user (send invitation email)
  app.post(`${apiPrefix}/users/invite`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { email, is_admin, permissions, permission_group_id } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.username, email));
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Generate a token for the invite
      const token = crypto.randomBytes(32).toString('hex');
      
      // Generate a temporary password hash (user will need to reset this)
      // This prevents the "Invalid account configuration" error
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto.createHash('sha256').update(tempPassword + salt).digest('hex');
      const passwordWithSalt = `${hashedPassword}:${salt}`;
      
      // Extract display name from email
      const emailUsername = email.split('@')[0]; // Get the part before @
      let displayName = emailUsername; // Default fallback
      
      if (emailUsername) {
        // Handle common naming patterns in emails
        if (emailUsername.includes('.') || emailUsername.includes('_') || emailUsername.includes('-')) {
          // Replace dots, underscores, etc. with spaces
          const nameParts = emailUsername.replace(/[._-]/g, ' ').split(' ');
          
          // Capitalize each part and join with space
          displayName = nameParts
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');
        } else {
          // Try to detect camelCase (e.g., johnSmith) or other patterns
          const nameParts = emailUsername.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
          
          if (nameParts.length === 1) {
            // If it's still one word, it might just be a single name or username
            displayName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
          } else {
            // Capitalize each part
            displayName = nameParts
              .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
              .join(' ');
          }
        }
      }
      
      // Create the user with the temporary password
      const userData = {
        username: email,
        is_admin: is_admin || false,
        permissions: permissions || [],
        password: passwordWithSalt, // Add temporary password
        display_name: displayName // Add extracted display name
      };
      
      // Create the user
      const result = await db.insert(users).values(userData).returning();
      const userId = result[0].id;
      
      // Handle permission group assignment if specified
      if (permission_group_id) {
        const groupId = parseInt(permission_group_id);
        
        // Verify the group exists
        const groupExists = await db.select().from(permissionGroups).where(eq(permissionGroups.id, groupId));
        if (groupExists.length === 0) {
          return res.status(400).json({ message: 'Permission group not found' });
        }
        
        // Add user to group
        await db.insert(userPermissionGroups).values({
          user_id: userId,
          group_id: groupId
        });
        
        // Update user permissions to match group
        if (groupExists[0].permissions) {
          await db.update(users)
            .set({ permissions: groupExists[0].permissions })
            .where(eq(users.id, userId));
        }
      } else {
        // If no group specified and there's a default group, assign user to it
        const defaultGroup = await db.select().from(permissionGroups).where(eq(permissionGroups.is_default, true));
        if (defaultGroup.length > 0) {
          await db.insert(userPermissionGroups).values({
            user_id: userId,
            group_id: defaultGroup[0].id
          });
          
          // Update user permissions to match group
          if (defaultGroup[0].permissions) {
            await db.update(users)
              .set({ permissions: defaultGroup[0].permissions })
              .where(eq(users.id, userId));
          }
        }
      }
      
      // Create an invitation email with a link to set password
      const inviteUrl = `${process.env.APP_URL || 'http://localhost:3000'}/set-password?token=${token}&username=${encodeURIComponent(email)}`;
      
      const subject = 'Invitation to AKSES';
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">You've been invited to AKSES!</h2>
          <p>You have been invited to join AKSES, the financial technology platform that manages and creates investment deals for fintechs in emerging markets.</p>
          <p>Click the button below to set your password and get started:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${inviteUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accept Invitation</a>
          </div>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0 0; font-weight: bold;">The AKSES Team</p>
          </div>
        </div>
      `;
      
      // Send the invitation email
      try {
        await sendEmail({ to: email, subject, body });
      } catch (emailError) {
        console.error('Failed to send invitation email:', emailError);
        // Continue even if email fails
      }
      
      res.status(201).json({ 
        message: 'User invited successfully',
        user: { id: result[0].id, username: result[0].username }
      });
    } catch (error) {
      console.error('Error inviting user:', error);
      res.status(500).json({ message: 'Failed to invite user' });
    }
  });

  // Permission Groups API Routes
  
  // Get all permission groups
  app.get(`${apiPrefix}/permission-groups`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const groups = await db.select().from(permissionGroups).orderBy(permissionGroups.name);
      res.json(groups);
    } catch (error) {
      console.error('Error fetching permission groups:', error);
      res.status(500).json({ message: 'Failed to fetch permission groups' });
    }
  });

  // Get a specific permission group
  app.get(`${apiPrefix}/permission-groups/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID' });
      }
      
      const groupResult = await db.select().from(permissionGroups).where(eq(permissionGroups.id, groupId));
      
      if (groupResult.length === 0) {
        return res.status(404).json({ message: 'Permission group not found' });
      }
      
      res.json(groupResult[0]);
    } catch (error) {
      console.error('Error fetching permission group:', error);
      res.status(500).json({ message: 'Failed to fetch permission group' });
    }
  });

  // Create a new permission group
  app.post(`${apiPrefix}/permission-groups`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { name, description, permissions, is_default } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Group name is required' });
      }
      
      // Check if group with this name already exists
      const existingGroup = await db.select().from(permissionGroups).where(eq(permissionGroups.name, name));
      if (existingGroup.length > 0) {
        return res.status(400).json({ message: 'Permission group with this name already exists' });
      }
      
      // Ensure permissions is a string array
      const permissionsArray: string[] = Array.isArray(permissions) 
        ? permissions.map(p => String(p)) 
        : [];
      
      // Build the data object manually
      const groupData = {
        name: name,
        description: description || null,
        permissions: permissionsArray,
        is_default: is_default || false
      };
      
      // If this is set as default, remove default flag from other groups
      if (groupData.is_default) {
        await db.update(permissionGroups)
          .set({ is_default: false })
          .where(eq(permissionGroups.is_default, true));
      }
      
      const result = await db.insert(permissionGroups).values(groupData).returning();
      
      res.status(201).json(result[0]);
    } catch (error) {
      console.error('Error creating permission group:', error);
      res.status(500).json({ message: 'Failed to create permission group' });
    }
  });

  // Update a permission group
  app.put(`${apiPrefix}/permission-groups/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID' });
      }
      
      const { name, description, permissions, is_default } = req.body;
      
      // Check if group exists
      const groupResult = await db.select().from(permissionGroups).where(eq(permissionGroups.id, groupId));
      if (groupResult.length === 0) {
        return res.status(404).json({ message: 'Permission group not found' });
      }
      
      // Check if name is unique (if changed)
      if (name && name !== groupResult[0].name) {
        const existingGroup = await db.select().from(permissionGroups).where(eq(permissionGroups.name, name));
        if (existingGroup.length > 0) {
          return res.status(400).json({ message: 'Permission group with this name already exists' });
        }
      }
      
      let updateData: any = {};
      
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (permissions !== undefined) updateData.permissions = permissions;
      if (is_default !== undefined) updateData.is_default = is_default;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No data provided for update' });
      }
      
      // If setting as default, remove default flag from other groups
      if (updateData.is_default) {
        await db.update(permissionGroups)
          .set({ is_default: false })
          .where(eq(permissionGroups.is_default, true));
      }
      
      const result = await db.update(permissionGroups)
        .set(updateData)
        .where(eq(permissionGroups.id, groupId))
        .returning();
      
      res.json(result[0]);
    } catch (error) {
      console.error('Error updating permission group:', error);
      res.status(500).json({ message: 'Failed to update permission group' });
    }
  });

  // Delete a permission group
  app.delete(`${apiPrefix}/permission-groups/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID' });
      }
      
      // Check if group exists
      const groupResult = await db.select().from(permissionGroups).where(eq(permissionGroups.id, groupId));
      if (groupResult.length === 0) {
        return res.status(404).json({ message: 'Permission group not found' });
      }
      
      // Delete all user associations first
      await db.delete(userPermissionGroups).where(eq(userPermissionGroups.group_id, groupId));
      
      // Then delete the group
      await db.delete(permissionGroups).where(eq(permissionGroups.id, groupId));
      
      res.json({ message: 'Permission group deleted successfully' });
    } catch (error) {
      console.error('Error deleting permission group:', error);
      res.status(500).json({ message: 'Failed to delete permission group' });
    }
  });

  // Get users in a permission group
  app.get(`${apiPrefix}/permission-groups/:id/users`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID' });
      }
      
      // Check if group exists
      const groupResult = await db.select().from(permissionGroups).where(eq(permissionGroups.id, groupId));
      if (groupResult.length === 0) {
        return res.status(404).json({ message: 'Permission group not found' });
      }
      
      // Get users in this group
      const userResults = await db
        .select({
          id: users.id,
          username: users.username,
          display_name: users.display_name,
          is_admin: users.is_admin,
          permissions: users.permissions,
          created_at: users.created_at,
          last_login: users.last_login
        })
        .from(users)
        .innerJoin(userPermissionGroups, eq(users.id, userPermissionGroups.user_id))
        .where(eq(userPermissionGroups.group_id, groupId));
      
      res.json(userResults);
    } catch (error) {
      console.error('Error fetching users in permission group:', error);
      res.status(500).json({ message: 'Failed to fetch users in permission group' });
    }
  });

  // Fix users with null passwords (admin only)
  app.post(`${apiPrefix}/users/fix-null-passwords`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Find all users with null passwords
      const usersWithNullPasswords = await db.select().from(users).where(sql`${users.password} IS NULL`);
      
      if (usersWithNullPasswords.length === 0) {
        return res.json({ message: 'No users with null passwords found' });
      }
      
      const updatedUsers = [];
      
      // Update each user with a temporary password
      for (const user of usersWithNullPasswords) {
        // Generate a temporary password
        const tempPassword = crypto.randomBytes(16).toString('hex');
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.createHash('sha256').update(tempPassword + salt).digest('hex');
        const passwordWithSalt = `${hashedPassword}:${salt}`;
        
        // Update the user
        await db.update(users)
          .set({ password: passwordWithSalt })
          .where(eq(users.id, user.id));
        
        updatedUsers.push({
          id: user.id,
          username: user.username
        });
        
        // Send password reset email
        try {
          const token = await generateResetToken(user.username);
          if (token) {
            const displayName = user.display_name || user.username;
            await sendPasswordResetEmail(user.username, displayName, token);
          }
        } catch (emailError) {
          console.error(`Failed to send password reset email to ${user.username}:`, emailError);
        }
      }
      
      res.json({ 
        message: `Fixed ${updatedUsers.length} users with null passwords`, 
        users: updatedUsers 
      });
    } catch (error) {
      console.error('Error fixing null passwords:', error);
      res.status(500).json({ message: 'Failed to fix null passwords' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
