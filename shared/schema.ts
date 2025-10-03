import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const boats = pgTable("boats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("₽"),
  year: integer("year").notNull(),
  manufacturer: text("manufacturer"),
  model: text("model"),
  length: decimal("length", { precision: 5, scale: 2 }),
  boatType: text("boat_type"),
  location: text("location").notNull(),
  photoCount: integer("photo_count").default(0),
  isPromoted: boolean("is_promoted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBoatSchema = createInsertSchema(boats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  price: z.number().positive(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  length: z.number().positive().optional(),
  photoCount: z.number().min(0).optional(),
  isPromoted: z.boolean().optional(),
});

export type InsertBoat = z.infer<typeof insertBoatSchema>;
export type Boat = typeof boats.$inferSelect;

export const aiSettings = pgTable("ai_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiSettingSchema = createInsertSchema(aiSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertAiSetting = z.infer<typeof insertAiSettingSchema>;
export type AiSetting = typeof aiSettings.$inferSelect;
