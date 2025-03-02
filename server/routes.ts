import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertDataPointSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/data-points", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const dataPoints = await storage.getDataPoints();
    res.json(dataPoints);
  });

  app.post("/api/data-points", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const data = insertDataPointSchema.parse(req.body);
      const dataPoint = await storage.createDataPoint(data);
      res.status(201).json(dataPoint);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json(e.errors);
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
