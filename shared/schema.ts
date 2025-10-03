import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for phone/password auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  phone: z.string().regex(/^\+7\d{10}$/, "Номер телефона должен быть в формате +7XXXXXXXXXX"),
  passwordHash: z.string().min(1),
});

export const registerUserSchema = z.object({
  phone: z.string().regex(/^\+7\d{10}$/, "Номер телефона должен быть в формате +7XXXXXXXXXX"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginUserSchema = z.object({
  phone: z.string().regex(/^\+7\d{10}$/, "Номер телефона должен быть в формате +7XXXXXXXXXX"),
  password: z.string().min(1, "Введите пароль"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;

export const boats = pgTable("boats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
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
  photoUrls: text("photo_urls").array().default(sql`ARRAY[]::text[]`),
  isPromoted: boolean("is_promoted").default(false),
  viewCount: integer("view_count").default(0),
  viewHistory: jsonb("view_history").default(sql`'[]'::jsonb`),
  sellerName: text("seller_name").default("BESTMARINE"),
  sellerRating: decimal("seller_rating", { precision: 2, scale: 1 }).default("4.7"),
  sellerReviewCount: integer("seller_review_count").default(49),
  phone: text("phone").default("+7 (999) 123-45-67"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBoatSchema = createInsertSchema(boats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  viewHistory: true,
}).extend({
  price: z.number().positive(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  length: z.number().positive().optional(),
  photoCount: z.number().min(0).optional(),
  photoUrls: z.array(z.string()).optional(),
  isPromoted: z.boolean().optional(),
  sellerName: z.string().optional(),
  sellerRating: z.number().min(0).max(5).optional(),
  sellerReviewCount: z.number().min(0).optional(),
  phone: z.string().optional(),
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
