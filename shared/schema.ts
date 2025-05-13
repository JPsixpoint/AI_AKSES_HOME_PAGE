import { pgTable, text, serial, integer, boolean, timestamp, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Deals table (akses_deals)
export const deals = pgTable("akses_deals", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // Company name
  priority: text("priority"),
  country: text("country"),
  lead: text("lead"), // Lead person's email
  creditHub: text("credit_hub"), // Credit hub region (LATAM, EMENA, SSA, APAC)
  stage: text("stage"), // Deal stage (Pass, Re-Engage, Pre-Screening, etc.)
  updates: json("updates"), // Array of update objects
  preScreening: json("pre_screening"), // Pre-screening data
  members: json("members"), // Team members associated
  aiScreening: json("ai_screening"), // AI Screening process data (added field)
  createdAt: timestamp("created_at").defaultNow(), // Creation timestamp
  updatedAt: timestamp("updated_at").defaultNow(), // Update timestamp
});

export const insertDealSchema = createInsertSchema(deals, {
  name: (schema) => schema.min(2, "Company name must be at least 2 characters"),
  stage: (schema) => schema.optional(),
  creditHub: (schema) => schema.optional()
}).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;

// SixPoint deals table (from CSV import)
export const sixpointDeals = pgTable("sixpoint_deals", {
  id: text("id").primaryKey(), // MongoDB-style ID from CSV
  name: text("name"), // Company name
  lead: text("lead"), // Lead person's email
  country: text("country"),
  creditHub: text("credit_hub"), // Credit hub region (LATAM, EMENA, SSA, APAC)
  stage: text("stage"), // Deal stage (Pass, Re-Engage, Pre-Screening, etc.)
  priority: text("priority"), // Priority level
  updates: json("updates"), // Array of update objects
  preScreening: json("pre_screening"), // Pre-screening data
  members: json("members"), // Team members associated
  createdAt: timestamp("created_at"), // Original creation timestamp
  contacts: json("contacts"), // Contact information
  importedAt: timestamp("imported_at").defaultNow().notNull(), // When the record was imported
});

export const insertSixpointDealSchema = createInsertSchema(sixpointDeals, {
  id: (schema) => schema.min(1, "ID is required"),
  name: (schema) => schema.optional(),
  lead: (schema) => schema.optional(),
  country: (schema) => schema.optional(),
  creditHub: (schema) => schema.optional(),
  stage: (schema) => schema.optional(),
  priority: (schema) => schema.optional(),
}).omit({
  importedAt: true,
});

export type InsertSixpointDeal = z.infer<typeof insertSixpointDealSchema>;
export type SixpointDeal = typeof sixpointDeals.$inferSelect;
