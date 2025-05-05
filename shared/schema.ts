import { pgTable, text, serial, integer, boolean, timestamp, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table - already defined
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

// Deals table
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  subSector: text("sub_sector").notNull(),
  value: integer("value").notNull(), // Deal value in cents/smallest currency unit
  region: text("region").notNull(),
  sector: text("sector").notNull(),
  status: text("status").notNull().default("Prescreening"), // Prescreening, Indicative Proposal, Due Diligence, Committed, Closed, Declined
  leadInvestor: text("lead_investor"),
  deadline: timestamp("deadline"), // Due diligence deadline
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  notes: text("notes"),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdBy: integer("created_by").references(() => users.id),
});

export const dealsRelations = relations(deals, ({ one }) => ({
  creator: one(users, {
    fields: [deals.createdBy],
    references: [users.id],
  }),
}));

export const insertDealSchema = createInsertSchema(deals, {
  company: (schema) => schema.min(2, "Company name must be at least 2 characters"),
  value: (schema) => schema.positive("Deal value must be positive"),
  region: (schema) => schema.min(2, "Region must be at least 2 characters"),
  sector: (schema) => schema.min(2, "Sector must be at least 2 characters"),
  status: (schema) => schema.refine(
    val => ["Prescreening", "Indicative Proposal", "Due Diligence", "Committed", "Closed", "Declined"].includes(val),
    "Invalid status"
  ),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true
});

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;

// SixPoint deals table (from CSV import)
export const sixpointDeals = pgTable("sixpoint_deals", {
  id: varchar("id", { length: 24 }).primaryKey(), // MongoDB-style ID from CSV
  name: text("name"), // Company name
  lead: text("lead"), // Lead person's email
  country: text("country"),
  creditHub: text("credit_hub"), // Credit hub region (LATAM, EMENA, SSA, APAC)
  stage: text("stage"), // Deal stage (Pass, Re-Engage, Pre-Screening, etc.)
  priority: text("priority"), // Priority level (1-5)
  updates: json("updates").$type<any[]>(), // Array of update objects
  preScreening: json("pre_screening").$type<Record<string, any>>(), // Pre-screening data
  members: json("members").$type<string[]>(), // Team members associated
  createdAt: timestamp("created_at"), // Original creation timestamp
  contacts: json("contacts").$type<Record<string, any> | string>(), // Contact information
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
