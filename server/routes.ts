import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProspectSchema, STATUSES, INTEREST_LEVELS, MAX_SALARY } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/prospects", async (_req, res) => {
    const prospects = await storage.getAllProspects();
    res.json(prospects);
  });

  app.post("/api/prospects", async (req, res) => {
    const parsed = insertProspectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    const prospect = await storage.createProspect(parsed.data);
    res.status(201).json(prospect);
  });

  app.patch("/api/prospects/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prospect ID" });
    }

    const existing = await storage.getProspect(id);
    if (!existing) {
      return res.status(404).json({ message: "Prospect not found" });
    }

    const body = req.body;
    const updates: Record<string, unknown> = {};

    if (body.companyName !== undefined) updates.companyName = body.companyName;
    if (body.roleTitle !== undefined) updates.roleTitle = body.roleTitle;
    if (body.jobUrl !== undefined) updates.jobUrl = body.jobUrl;
    if (body.notes !== undefined) updates.notes = body.notes;

    if (body.interviewDate !== undefined) {
      if (body.interviewDate === null) {
        updates.interviewDate = null;
      } else {
        const ivValid = typeof body.interviewDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.interviewDate) && (() => {
          const [y, m, d] = body.interviewDate.split("-").map(Number);
          const dt = new Date(Date.UTC(y, m - 1, d));
          return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
        })();
        if (!ivValid) {
          return res.status(400).json({ message: "Interview date must be a valid date (YYYY-MM-DD)" });
        }
        updates.interviewDate = body.interviewDate;
      }
    }

    if (body.deadline !== undefined) {
      if (body.deadline === null) {
        updates.deadline = null;
      } else {
        const dlValid = typeof body.deadline === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.deadline) && (() => {
          const [y, m, d] = body.deadline.split("-").map(Number);
          const dt = new Date(Date.UTC(y, m - 1, d));
          return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
        })();
        if (!dlValid) {
          return res.status(400).json({ message: "Deadline must be a valid date (YYYY-MM-DD)" });
        }
        updates.deadline = body.deadline;
      }
    }

    if (body.salary !== undefined) {
      if (body.salary === null) {
        updates.salary = null;
      } else {
        const s = body.salary;
        if (typeof s !== "number" || !Number.isInteger(s) || s < 0 || s > MAX_SALARY) {
          return res.status(400).json({ message: `Salary must be a whole number between 0 and ${MAX_SALARY.toLocaleString()}` });
        }
        updates.salary = s;
      }
    }

    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) {
        return res.status(400).json({ message: `Status must be one of: ${STATUSES.join(", ")}` });
      }
      updates.status = body.status;
    }

    if (body.interestLevel !== undefined || body.interest_level !== undefined) {
      const level = body.interestLevel ?? body.interest_level;
      if (!INTEREST_LEVELS.includes(level)) {
        return res.status(400).json({ message: `Interest level must be one of: ${INTEREST_LEVELS.join(", ")}` });
      }
      updates.interestLevel = level;
    }

    const updated = await storage.updateProspect(id, updates);
    res.json(updated);
  });

  app.delete("/api/prospects/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prospect ID" });
    }

    const deleted = await storage.deleteProspect(id);
    if (!deleted) {
      return res.status(404).json({ message: "Prospect not found" });
    }

    res.status(204).send();
  });

  return httpServer;
}
