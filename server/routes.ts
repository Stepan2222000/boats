import type { Express } from "express";
import { createServer, type Server } from "http";
import "./express-session.d.ts";
import { storage } from "./storage";
import { insertBoatSchema, registerUserSchema, loginUserSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { interpretSearchQuery, validateDescription, generateListingWithWebSearch, generateBoatListingWithResponses } from "./openai";
import { z } from "zod";
import { upload, getFileUrl } from "./fileStorage";
import { registerUser, loginUser } from "./auth";
import { setupWebSocket, broadcastBoatUpdate } from "./websocket";

// Middleware to check authentication
export function isAuthenticated(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Необходима авторизация" });
  }
  next();
}

// Middleware to check admin privileges
async function isAdmin(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Необходима авторизация" });
  }
  
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user || user.phone !== "root") {
      return res.status(403).json({ message: "Доступ запрещен. Требуются права администратора" });
    }
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({ message: "Ошибка проверки прав доступа" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      const result = registerUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const normalizedPhone = result.data.phone.replace(/\s+/g, '').trim();
      if (normalizedPhone === "root") {
        return res.status(403).json({ message: "Этот номер телефона зарезервирован" });
      }

      const user = await registerUser(result.data);
      req.session.userId = user.id;
      
      res.json({ 
        authenticated: true, 
        user: {
          id: user.id,
          phone: user.phone,
          createdAt: user.createdAt,
        }
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.message.includes('duplicate') || error.message.includes('уже существует')) {
        return res.status(409).json({ message: "Пользователь с таким номером телефона уже существует" });
      }
      
      res.status(400).json({ message: "Ошибка при регистрации" });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const result = loginUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const user = await loginUser(result.data);
      req.session.userId = user.id;
      
      res.json({ 
        authenticated: true, 
        user: {
          id: user.id,
          phone: user.phone,
          createdAt: user.createdAt,
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(401).json({ message: "Неверный номер телефона или пароль" });
    }
  });

  app.post('/api/logout', async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Ошибка при выходе" });
      }
      res.json({ message: "Успешный выход" });
    });
  });

  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.json({ authenticated: false, user: null });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.json({ authenticated: false, user: null });
      }
      
      res.json({ 
        authenticated: true, 
        user: {
          id: user.id,
          phone: user.phone,
          createdAt: user.createdAt,
        }
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/boats", async (req, res) => {
    try {
      const boats = await storage.getBoatsByStatus("approved");
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

  app.post("/api/boats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      
      const result = insertBoatSchema.safeParse({
        ...req.body,
        userId,
      });
      
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

  app.put("/api/boats/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const boat = await storage.getBoat(req.params.id);
      
      if (!boat) {
        return res.status(404).json({ error: "Boat not found" });
      }

      if (boat.userId !== userId) {
        return res.status(403).json({ error: "You don't have permission to edit this listing" });
      }

      const result = insertBoatSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const updatedBoat = await storage.updateBoat(req.params.id, result.data);
      res.json(updatedBoat);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/boats/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const boat = await storage.getBoat(req.params.id);
      
      if (!boat) {
        return res.status(404).json({ error: "Boat not found" });
      }

      if (boat.userId !== userId) {
        return res.status(403).json({ error: "You don't have permission to delete this listing" });
      }

      await storage.deleteBoat(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/boats/:id/view", async (req: any, res) => {
    try {
      const userId = req.session?.userId || null;
      const success = await storage.recordView(req.params.id, userId);
      
      if (!success) {
        return res.status(404).json({ error: "Boat not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error recording view:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/boats/:id/contacts", async (req: any, res) => {
    try {
      // Allow admin to access contacts
      const isAdminUser = req.session?.userId ? 
        (await storage.getUser(req.session.userId))?.phone === "root" : false;
      
      if (!isAdminUser) {
        // For non-admin, you might want to add additional checks here
        // For now, allow public access as per original design
      }
      
      const contacts = await storage.getBoatContacts(req.params.id);
      res.json(contacts);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/boats/validate", async (req, res) => {
    try {
      const schema = z.object({
        description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }

      const validationResult = await validateDescription(result.data.description);
      res.json(validationResult);
    } catch (error: any) {
      console.error("Validation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/boats/create-with-contacts", async (req: any, res) => {
    try {
      const schema = z.object({
        rawDescription: z.string().min(10),
        extractedData: z.object({
          price: z.number().positive(),
          year: z.number().int(),
          manufacturer: z.string().nullable(),
          model: z.string().nullable(),
        }),
        photoUrls: z.array(z.string()),
        contacts: z.array(z.object({
          contactType: z.enum(["phone", "whatsapp", "telegram", "in_app_chat"]),
          contactValue: z.string(),
        })),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }

      const userId = req.session?.userId || null;

      // Создаем объявление сразу с базовой информацией
      const manufacturer = result.data.extractedData.manufacturer;
      const model = result.data.extractedData.model;
      const year = result.data.extractedData.year;
      
      const basicTitle = manufacturer && model 
        ? `${manufacturer} ${model} ${year}`
        : `Лодка ${year} года`;

      const boatData: any = {
        userId,
        title: basicTitle,
        description: result.data.rawDescription,
        rawDescription: result.data.rawDescription,
        status: "ai_processing" as const,
        price: result.data.extractedData.price,
        currency: "₽" as const,
        year: result.data.extractedData.year,
        location: "Не указано",
        manufacturer: result.data.extractedData.manufacturer,
        model: result.data.extractedData.model,
        photoCount: result.data.photoUrls.length,
        photoUrls: result.data.photoUrls,
        isPromoted: false,
      };

      const boatValidation = insertBoatSchema.safeParse(boatData);
      if (!boatValidation.success) {
        return res.status(400).json({ error: fromZodError(boatValidation.error).message });
      }

      const boat = await storage.createBoat(boatValidation.data);

      for (const contact of result.data.contacts) {
        await storage.createBoatContact({
          boatId: boat.id,
          contactType: contact.contactType,
          contactValue: contact.contactValue,
        });
      }

      // Запускаем AI обработку в фоне (не блокируем ответ) с Responses API
      generateBoatListingWithResponses({
        rawDescription: result.data.rawDescription,
        price: result.data.extractedData.price,
        year: result.data.extractedData.year,
        location: "Не указано",
        photoUrls: result.data.photoUrls,
      })
        .then(async (aiResult) => {
          // Обновляем объявление с AI результатами (все поля из Avito)
          await storage.updateBoat(boat.id, {
            title: aiResult.title,
            description: aiResult.description,
            manufacturer: aiResult.manufacturer,
            model: aiResult.model,
            manufacturerCountry: aiResult.manufacturerCountry,
            category: aiResult.category,
            length: aiResult.length,
            width: aiResult.width,
            draft: aiResult.draft,
            maxPassengers: aiResult.maxPassengers,
            hullMaterial: aiResult.hullMaterial,
            boatType: aiResult.boatType,
            engineType: aiResult.engineType,
            trailerIncluded: aiResult.trailerIncluded,
            availability: aiResult.availability,
            condition: aiResult.condition,
            sources: aiResult.sources || [],
            warnings: aiResult.warnings || [],
            status: "ai_ready" as const,
          });
          console.log(`AI processing completed for boat ${boat.id} with ${aiResult.sources?.length || 0} sources`);
          broadcastBoatUpdate(boat.id, "ai_ready");
        })
        .catch((error) => {
          console.error(`AI processing failed for boat ${boat.id}:`, error);
          // Сохраняем ошибку в базе
          storage.updateBoat(boat.id, {
            aiError: error.message || "Unknown AI processing error",
            status: "ai_ready" as const,
          }).then(() => {
            broadcastBoatUpdate(boat.id, "ai_ready");
          }).catch(err => console.error("Failed to save AI error:", err));
        });

      // Сразу возвращаем успех
      res.status(201).json({ boat });
    } catch (error: any) {
      console.error("Create with contacts error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileUrl = getFileUrl(req.file.filename);
      res.json({ url: fileUrl });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get all boats (including all statuses)
  app.get("/api/admin/boats", isAdmin, async (req, res) => {
    try {
      const boats = await storage.getAllBoats();
      res.json(boats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Edit any boat
  app.put("/api/admin/boats/:id", isAdmin, async (req, res) => {
    try {
      const result = insertBoatSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const updatedBoat = await storage.updateBoat(req.params.id, result.data);
      if (!updatedBoat) {
        return res.status(404).json({ error: "Boat not found" });
      }
      broadcastBoatUpdate(req.params.id, updatedBoat.status);
      res.json(updatedBoat);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Approve boat
  app.post("/api/admin/boats/:id/approve", isAdmin, async (req, res) => {
    try {
      const boat = await storage.updateBoat(req.params.id, { status: "approved" });
      if (!boat) {
        return res.status(404).json({ error: "Boat not found" });
      }
      broadcastBoatUpdate(req.params.id, "approved");
      res.json(boat);
    } catch (error: any) {
      console.error("Error approving boat:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Reject boat
  app.post("/api/admin/boats/:id/reject", isAdmin, async (req, res) => {
    try {
      const rejectSchema = z.object({
        reason: z.string().optional(),
      });

      const result = rejectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const boat = await storage.updateBoat(req.params.id, { 
        status: "rejected",
        rejectionReason: result.data.reason || "Не указана",
      });
      if (!boat) {
        return res.status(404).json({ error: "Boat not found" });
      }
      broadcastBoatUpdate(req.params.id, "rejected");
      res.json(boat);
    } catch (error: any) {
      console.error("Error rejecting boat:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/ai-settings", isAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllAiSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/ai-settings", isAdmin, async (req, res) => {
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

  // Initialize WebSocket for real-time updates
  setupWebSocket(httpServer);

  return httpServer;
}
