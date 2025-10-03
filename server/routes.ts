import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBoatSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { generateBoatListing, interpretSearchQuery } from "./openai";
import { z } from "zod";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/boats", async (req, res) => {
    try {
      const boats = await storage.getAllBoats();
      res.json(boats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/boats/ai-search", async (req, res) => {
    try {
      const aiSearchSchema = z.object({
        query: z.string().min(1, "Query cannot be empty"),
      });

      const inputResult = aiSearchSchema.safeParse(req.body);
      if (!inputResult.success) {
        return res.status(400).json({ 
          error: fromZodError(inputResult.error).message 
        });
      }

      const searchParams = await interpretSearchQuery(inputResult.data.query);

      const boats = await storage.searchBoats({
        query: searchParams.query || undefined,
        minPrice: searchParams.minPrice || undefined,
        maxPrice: searchParams.maxPrice || undefined,
        year: searchParams.year || undefined,
        boatType: searchParams.boatType || undefined,
        location: searchParams.location || undefined,
      });

      res.json({
        boats,
        interpretedParams: searchParams,
      });
    } catch (error: any) {
      console.error("AI search error:", error);
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

  app.post("/api/boats/ai-create", async (req, res) => {
    try {
      const aiInputSchema = z.object({
        rawDescription: z.string().min(10, "Description must be at least 10 characters"),
        price: z.coerce.number().positive("Price must be a positive number"),
        year: z.coerce.number()
          .int("Year must be a whole number")
          .min(1900, "Year must be at least 1900")
          .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
        location: z.string().min(2, "Location must be at least 2 characters"),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        length: z.coerce.number().positive("Length must be positive").optional(),
      });

      const inputResult = aiInputSchema.safeParse(req.body);
      if (!inputResult.success) {
        return res.status(400).json({ 
          error: fromZodError(inputResult.error).message 
        });
      }

      const aiResult = await generateBoatListing({
        rawDescription: inputResult.data.rawDescription,
        price: inputResult.data.price.toString(),
        year: inputResult.data.year.toString(),
        location: inputResult.data.location,
        manufacturer: inputResult.data.manufacturer,
        model: inputResult.data.model,
        length: inputResult.data.length?.toString(),
      });

      const boatData = {
        title: aiResult.title,
        description: aiResult.description,
        price: inputResult.data.price,
        currency: "₽" as const,
        year: inputResult.data.year,
        location: inputResult.data.location,
        manufacturer: aiResult.manufacturer,
        model: aiResult.model,
        boatType: aiResult.boatType,
        length: aiResult.length,
        photoCount: req.body.photoUrls?.length || 0,
        photoUrls: req.body.photoUrls || [],
        isPromoted: false,
      };

      const validationResult = insertBoatSchema.safeParse(boatData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: fromZodError(validationResult.error).message 
        });
      }

      const boat = await storage.createBoat(validationResult.data);
      res.status(201).json(boat);
    } catch (error: any) {
      console.error("AI create error:", error);
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

  // Object Storage endpoints
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error getting object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const normalizedPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      res.json({ uploadURL, normalizedPath });
    } catch (error: any) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/objects/download-url", async (req, res) => {
    try {
      const { objectPath } = req.body;
      if (!objectPath) {
        return res.status(400).json({ error: "objectPath is required" });
      }
      const objectStorageService = new ObjectStorageService();
      const downloadURL = await objectStorageService.getObjectEntityDownloadURL(objectPath);
      res.json({ downloadURL });
    } catch (error: any) {
      console.error("Error getting download URL:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
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

  app.get("/api/admin/ai-settings", async (req, res) => {
    try {
      const settings = await storage.getAllAiSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/ai-settings", async (req, res) => {
    try {
      const updateSchema = z.object({
        key: z.string().min(1),
        value: z.string().min(1),
        description: z.string().optional(),
      });

      const result = updateSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const setting = await storage.upsertAiSetting(
        result.data.key, 
        result.data.value, 
        result.data.description
      );
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
