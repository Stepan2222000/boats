import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBoatSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/boats", async (req, res) => {
    try {
      const boats = await storage.getAllBoats();
      res.json(boats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/boats/search", async (req, res) => {
    try {
      const { query, minPrice, maxPrice, year, boatType, location } = req.query;
      
      const searchParams = {
        query: query as string | undefined,
        minPrice: minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        year: year ? parseInt(year as string) : undefined,
        boatType: boatType as string | undefined,
        location: location as string | undefined,
      };

      const boats = await storage.searchBoats(searchParams);
      res.json(boats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/boats/:id", async (req, res) => {
    try {
      const boat = await storage.getBoat(req.params.id);
      if (!boat) {
        return res.status(404).json({ error: "Boat not found" });
      }
      res.json(boat);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/boats", async (req, res) => {
    try {
      const result = insertBoatSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const boat = await storage.createBoat(result.data);
      res.status(201).json(boat);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/boats/:id", async (req, res) => {
    try {
      const result = insertBoatSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const boat = await storage.updateBoat(req.params.id, result.data);
      if (!boat) {
        return res.status(404).json({ error: "Boat not found" });
      }
      res.json(boat);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/boats/:id", async (req, res) => {
    try {
      const success = await storage.deleteBoat(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Boat not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
