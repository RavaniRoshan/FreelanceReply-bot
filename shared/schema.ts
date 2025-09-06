/**
 * @fileoverview This file defines the database schema for the application using
 * Drizzle ORM. It also defines the types and insert schemas for each table.
 */

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * The users table stores information about the application's users.
 */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

/**
 * The templates table stores response templates created by users.
 */
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  variables: jsonb("variables").default([]),
  isActive: boolean("is_active").default(true),
  successRate: integer("success_rate").default(0),
  timesUsed: integer("times_used").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * The inquiries table stores customer inquiries received by users.
 */
export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  category: text("category"),
  priority: text("priority").default("normal"),
  source: text("source").default("email"),
  sender: text("sender"),
  aiClassification: jsonb("ai_classification"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * The responses table stores responses sent to customers.
 */
export const responses = pgTable("responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inquiryId: varchar("inquiry_id").notNull(),
  templateId: varchar("template_id"),
  content: text("content").notNull(),
  isAutomated: boolean("is_automated").default(true),
  wasModified: boolean("was_modified").default(false),
  sentAt: timestamp("sent_at").defaultNow(),
  customerFeedback: integer("customer_feedback"),
  success: boolean("success"),
});

/**
 * The integrations table stores information about third-party integrations.
 */
export const integrations = pgTable("integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  platform: text("platform").notNull(),
  isActive: boolean("is_active").default(false),
  credentials: jsonb("credentials"),
  settings: jsonb("settings").default({}),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * The analytics table stores analytics data for users.
 */
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  totalInquiries: integer("total_inquiries").default(0),
  automatedResponses: integer("automated_responses").default(0),
  manualResponses: integer("manual_responses").default(0),
  averageResponseTime: integer("average_response_time").default(0),
  customerSatisfaction: integer("customer_satisfaction").default(0),
  timeSaved: integer("time_saved").default(0),
});

// --- Insert schemas ---

/**
 * Zod schema for inserting a new user.
 */
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

/**
 * Zod schema for inserting a new template.
 */
export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for inserting a new inquiry.
 */
export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

/**
 * Zod schema for inserting a new response.
 */
export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  sentAt: true,
});

/**
 * Zod schema for inserting a new integration.
 */
export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  lastSync: true,
});

/**
 * Zod schema for inserting new analytics data.
 */
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  date: true,
});

// --- Types ---

/**
 * Type for a user record.
 */
export type User = typeof users.$inferSelect;
/**
 * Type for inserting a new user.
 */
export type InsertUser = z.infer<typeof insertUserSchema>;

/**
 * Type for a template record.
 */
export type Template = typeof templates.$inferSelect;
/**
 * Type for inserting a new template.
 */
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

/**
 * Type for an inquiry record.
 */
export type Inquiry = typeof inquiries.$inferSelect;
/**
 * Type for inserting a new inquiry.
 */
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

/**
 * Type for a response record.
 */
export type Response = typeof responses.$inferSelect;
/**
 * Type for inserting a new response.
 */
export type InsertResponse = z.infer<typeof insertResponseSchema>;

/**
 * Type for an integration record.
 */
export type Integration = typeof integrations.$inferSelect;
/**
 * Type for inserting a new integration.
 */
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

/**
 * Type for an analytics record.
 */
export type Analytics = typeof analytics.$inferSelect;
/**
 * Type for inserting new analytics data.
 */
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
