import { type Boat, type InsertBoat, boats, type AiSetting, aiSettings, type User, type PublicUser, users, type BoatContact, type InsertBoatContact, boatContacts } from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<PublicUser | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: { phone: string; passwordHash: string }): Promise<PublicUser>;
  getAllUsers(): Promise<PublicUser[]>;
  getBoat(id: string): Promise<Boat | undefined>;
  getAllBoats(): Promise<Boat[]>;
  getBoatsByStatus(status: string): Promise<Boat[]>;
  updateBoatStatus(id: string, status: string): Promise<Boat | undefined>;
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
  recordView(boatId: string, userId: string | null): Promise<boolean>;
  createBoatContact(contact: InsertBoatContact): Promise<BoatContact>;
  getBoatContacts(boatId: string): Promise<BoatContact[]>;
  getAllAiSettings(): Promise<AiSetting[]>;
  getAiSetting(key: string): Promise<AiSetting | undefined>;
  upsertAiSetting(key: string, value: string, description?: string): Promise<AiSetting>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<PublicUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return undefined;
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async createUser(userData: { phone: string; passwordHash: string }): Promise<PublicUser> {
    const [user] = await db
      .insert(users)
      .values({
        phone: userData.phone,
        passwordHash: userData.passwordHash,
      })
      .returning();
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  async getAllUsers(): Promise<PublicUser[]> {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return allUsers.map(({ passwordHash, ...publicUser }) => publicUser);
  }

  async getBoat(id: string): Promise<Boat | undefined> {
    const result = await db.select().from(boats).where(eq(boats.id, id)).limit(1);
    return result[0];
  }

  async getAllBoats(): Promise<Boat[]> {
    return await db.select().from(boats).orderBy(desc(boats.createdAt));
  }

  async getBoatsByStatus(status: string): Promise<Boat[]> {
    return await db.select().from(boats).where(eq(boats.status, status)).orderBy(desc(boats.createdAt));
  }

  async updateBoatStatus(id: string, status: string): Promise<Boat | undefined> {
    const result = await db
      .update(boats)
      .set({ status, updatedAt: new Date() })
      .where(eq(boats.id, id))
      .returning();
    return result[0];
  }

  async searchBoats(params: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
    boatType?: string;
    location?: string;
  }): Promise<Boat[]> {
    const conditions = [eq(boats.status, "approved")];

    if (params.query) {
      const searchCondition = or(
        ilike(boats.title, `%${params.query}%`),
        ilike(boats.description, `%${params.query}%`),
        ilike(boats.manufacturer, `%${params.query}%`),
        ilike(boats.model, `%${params.query}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
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

    return await db
      .select()
      .from(boats)
      .where(sql`${sql.join(conditions, sql` AND `)}`)
      .orderBy(desc(boats.isPromoted), desc(boats.createdAt));
  }

  async createBoat(insertBoat: InsertBoat): Promise<Boat> {
    const boatData: any = {
      ...insertBoat,
      length: insertBoat.length ? insertBoat.length.toString() : null,
      width: insertBoat.width ? insertBoat.width.toString() : null,
      draft: insertBoat.draft ? insertBoat.draft.toString() : null,
    };
    const result = await db.insert(boats).values(boatData).returning();
    return result[0];
  }

  async updateBoat(id: string, updateData: Partial<InsertBoat>): Promise<Boat | undefined> {
    const boatData: any = {
      ...updateData,
      length: updateData.length !== undefined ? (updateData.length !== null ? updateData.length.toString() : null) : undefined,
      width: updateData.width !== undefined ? (updateData.width !== null ? updateData.width.toString() : null) : undefined,
      draft: updateData.draft !== undefined ? (updateData.draft !== null ? updateData.draft.toString() : null) : undefined,
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

  async recordView(boatId: string, userId: string | null): Promise<boolean> {
    try {
      const boat = await this.getBoat(boatId);
      if (!boat) return false;

      const currentHistory = (boat.viewHistory as any) || [];
      const newView = {
        userId: userId || "anonymous",
        timestamp: new Date().toISOString(),
      };

      await db
        .update(boats)
        .set({
          viewCount: (boat.viewCount || 0) + 1,
          viewHistory: [...currentHistory, newView] as any,
        })
        .where(eq(boats.id, boatId));

      return true;
    } catch (error) {
      console.error("Error recording view:", error);
      return false;
    }
  }

  async getAllAiSettings(): Promise<AiSetting[]> {
    return await db.select().from(aiSettings).orderBy(aiSettings.settingKey);
  }

  async getAiSetting(key: string): Promise<AiSetting | undefined> {
    const result = await db.select().from(aiSettings).where(eq(aiSettings.settingKey, key)).limit(1);
    return result[0];
  }

  async upsertAiSetting(key: string, value: string, description?: string): Promise<AiSetting> {
    const existing = await this.getAiSetting(key);
    
    if (existing) {
      const result = await db
        .update(aiSettings)
        .set({ settingValue: value, description, updatedAt: new Date() })
        .where(eq(aiSettings.settingKey, key))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(aiSettings)
        .values({ settingKey: key, settingValue: value, description })
        .returning();
      return result[0];
    }
  }

  async createBoatContact(contact: InsertBoatContact): Promise<BoatContact> {
    const [result] = await db
      .insert(boatContacts)
      .values(contact)
      .returning();
    return result;
  }

  async getBoatContacts(boatId: string): Promise<BoatContact[]> {
    return await db
      .select()
      .from(boatContacts)
      .where(eq(boatContacts.boatId, boatId))
      .orderBy(boatContacts.createdAt);
  }
}

export const storage = new DbStorage();
