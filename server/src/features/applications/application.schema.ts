import { z } from "zod";
import { SOURCES, STATUSES, TRACKS } from "./application.model";

export const createApplicationSchema = z.object({
  body: z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    status: z.enum(STATUSES).optional(),
    source: z.enum(SOURCES).optional(),
    track: z.enum(TRACKS).optional(),
    appliedAt: z.coerce.date().optional(),
    followUpAt: z.coerce.date().optional(),
    deadlineAt: z.coerce.date().optional(),
    resumeVersion: z.string().optional(),
    contact: z.string().optional(),
    jobUrl: z.string().optional(),
    notes: z.string().optional(),
    position: z.number().optional(),
  }),
});

export const updateApplicationSchema = z.object({
  body: createApplicationSchema.shape.body.partial(),
});

export const moveApplicationSchema = z.object({
  body: z.object({
    status: z.enum(STATUSES),
    position: z.number(),
  }),
});