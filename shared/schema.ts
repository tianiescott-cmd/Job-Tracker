import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const STATUSES = [
  "Bookmarked",
  "Applied",
  "Phone Screen",
  "Interviewing",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;

export const INTEREST_LEVELS = ["High", "Medium", "Low"] as const;

export const MAX_SALARY = 10_000_000;

export const prospects = pgTable("prospects", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  roleTitle: text("role_title").notNull(),
  jobUrl: text("job_url"),
  status: text("status").notNull().default("Bookmarked"),
  interestLevel: text("interest_level").notNull().default("Medium"),
  salary: integer("salary"),
  deadline: text("deadline"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const DEADLINE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const insertProspectSchema = createInsertSchema(prospects).omit({
  id: true,
  createdAt: true,
}).extend({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  status: z.enum(STATUSES).default("Bookmarked"),
  interestLevel: z.enum(INTEREST_LEVELS).default("Medium"),
  salary: z.number().int("Salary must be a whole number").min(0, "Salary cannot be negative").max(MAX_SALARY, `Salary cannot exceed ${MAX_SALARY.toLocaleString()}`).optional().nullable(),
  deadline: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must be a valid date (YYYY-MM-DD)").refine((val) => {
      const [y, m, d] = val.split("-").map(Number);
      const date = new Date(Date.UTC(y, m - 1, d));
      return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
    }, "Deadline must be a valid date").optional().nullable(),
  ),
  jobUrl: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type InsertProspect = z.infer<typeof insertProspectSchema>;
export type Prospect = typeof prospects.$inferSelect;
