// Zod: schema = "rulebook". validate middleware {body, query, params} ko check karta hai, isliye har schema ka shape { body: z.object({...}) }
import { z } from "zod";
import { STATUSES, SOURCES, TRACKS } from "../models/application.model";

const createApplicationSchema = z.object({
    body: z.object({
        company: z.string().min(1, "Company name is required"),
        role: z.string().min(1),
        status: z.enum(STATUSES).optional(),
        source: z.enum(SOURCES).optional(),
        track: z.enum(TRACKS).optional(),
        appliedAt: z.coerce.date().optional(),
        followUpAt: z.date().optional(),
        deadlineAt: z.date().optional(),
        resumeVersion: z.string().optional(),
        contact: z.string().optional(),
        jobUrl: z.string().optional(),
        notes: z.string().optional(),
    })
});

export const updateApplicationSchema = z.object({
    body: createApplicationSchema.shape.body.omit({ status : true}).partial() })


export const moveApplicationSchema = z.object({
    body: z.object({
        status: z.enum(STATUSES),
        position: z.number(),
    })
});

export const listQuerySchema = z.object({ query : z.object({
    status: z.enum(STATUSES).optional(),
    source: z.enum(SOURCES).optional(),
    track: z.enum(TRACKS).optional(),
    search:z.string().optional(),
    page:z.coerce.number().int().min(1).optional(),
    limit:z.coerce.number().int().min(1).max(100).optional()
})})
//   NOTE: .default() yahan kaam nahi karega (Express 5 mein req.query badla nahi ja sakta). Defaults controller mein do.