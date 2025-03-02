import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dataPoints = pgTable("data_points", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  value: integer("value").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  category: text("category").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  name: true,
  type: true,
  status: true,
  metrics: true,
});

export const insertDataPointSchema = createInsertSchema(dataPoints).pick({
  campaignId: true,
  value: true,
  timestamp: true,
  category: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type DataPoint = typeof dataPoints.$inferSelect;
