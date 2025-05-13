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

// Deals table (using the akses_deals table)
export const deals = pgTable("akses_deals", {
  id: varchar("id", { length: 24 }).primaryKey(),
  name: text("name"), // Company name
  priority: text("priority"),
  country: text("country"),
  lead: text("lead"), // Lead person's email
  creditHub: text("credit_hub"), // Credit hub region (LATAM, EMENA, SSA, APAC)
  stage: text("stage").notNull().default("Pre-Screening"), // Deal stage (Pass, Re-Engage, Pre-Screening, etc.)
  updates: json("updates").$type<any[]>().default([]), // Array of update objects
  members: json("members").$type<string[]>().default([]), // Team members associated
  preScreening: json("pre_screening").$type<Record<string, any>>().default({}), // Pre-screening data
  aiScreening: json("ai_screening").$type<{
    timestamp: string;
    initiatingUser: string;
    recipientEmails: string[];
    emailContent: string;
    additionalContext: string;
    status: "sent" | "not_sent";
    trackingData: {
      status: "sent" | "opened" | "interacting" | "completed" | "abandoned";
      progress: number;
      lastInteraction: string;
    };
  }[]>().default([]), // AI Screening process data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

export const dealsRelations = relations(deals, ({ one }) => ({
  creator: one(users, {
    fields: [deals.createdBy],
    references: [users.id],
  }),
}));

export const insertDealSchema = createInsertSchema(deals, {
  name: (schema) => schema.min(2, "Company name must be at least 2 characters"),
  stage: (schema) => schema.refine(
    val => ["Pre-Screening", "Lead", "Due Diligence & U/W", "Term Sheet Negotiation", "Closed - Won", "Closed - Lost", "Pass", "Re-Engage"].includes(val),
    "Invalid stage"
  ),
  creditHub: (schema) => schema.refine(
    val => ["LATAM", "EMENA", "SSA", "APAC"].includes(val),
    "Invalid credit hub"
  )
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
