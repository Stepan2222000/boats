import { type Boat, type InsertBoat, boats } from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  getBoat(id: string): Promise<Boat | undefined>;
  getAllBoats(): Promise<Boat[]>;
  searchBoats(params: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
    boatType?: string;
    location?: string;
  }): Promise<Boat[]>;
  createBoat(boat: InsertBoat): Promise<Boat>;
  updateBoat(id: string, boat: Partial<InsertBoat>): Promise<Boat | undefined>;
  deleteBoat(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  async getBoat(id: string): Promise<Boat | undefined> {
    const result = await db.select().from(boats).where(eq(boats.id, id)).limit(1);
    return result[0];
  }

  async getAllBoats(): Promise<Boat[]> {
    return await db.select().from(boats).orderBy(desc(boats.createdAt));
  }

  async searchBoats(params: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
    boatType?: string;
    location?: string;
  }): Promise<Boat[]> {
    const conditions = [];

    if (params.query) {
      conditions.push(
        or(
          ilike(boats.title, `%${params.query}%`),
          ilike(boats.description, `%${params.query}%`),
          ilike(boats.manufacturer, `%${params.query}%`),
          ilike(boats.model, `%${params.query}%`)
        )
      );
    }

    if (params.minPrice !== undefined) {
      conditions.push(sql`${boats.price} >= ${params.minPrice}`);
    }

    if (params.maxPrice !== undefined) {
      conditions.push(sql`${boats.price} <= ${params.maxPrice}`);
    }

    if (params.year) {
      conditions.push(eq(boats.year, params.year));
    }

    if (params.boatType) {
      conditions.push(eq(boats.boatType, params.boatType));
    }

    if (params.location) {
      conditions.push(ilike(boats.location, `%${params.location}%`));
    }

    if (conditions.length > 0) {
      return await db
        .select()
        .from(boats)
        .where(sql`${sql.join(conditions, sql` AND `)}`)
        .orderBy(desc(boats.isPromoted), desc(boats.createdAt));
    }

    return await db.select().from(boats).orderBy(desc(boats.isPromoted), desc(boats.createdAt));
  }

  async createBoat(insertBoat: InsertBoat): Promise<Boat> {
    const boatData: any = {
      ...insertBoat,
      length: insertBoat.length ? insertBoat.length.toString() : null,
    };
    const result = await db.insert(boats).values(boatData).returning();
    return result[0];
  }

  async updateBoat(id: string, updateData: Partial<InsertBoat>): Promise<Boat | undefined> {
    const boatData: any = {
      ...updateData,
      length: updateData.length ? updateData.length.toString() : undefined,
      updatedAt: new Date(),
    };
    const result = await db
      .update(boats)
      .set(boatData)
      .where(eq(boats.id, id))
      .returning();
    return result[0];
  }

  async deleteBoat(id: string): Promise<boolean> {
    const result = await db.delete(boats).where(eq(boats.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
