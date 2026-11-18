import { Schema, model, Types } from "mongoose";

export const STATUSES = ["Applied", "Interviewing", "Offered", "Rejected"] as const;
export const SOURCES = ["LinkedIn", "Indeed", "Glassdoor", "Referral", "InternShala", "HR", "Other"] as const;
export const TRACKS = ["Frontend", "Backend", "Fullstack", "SDE", "Data", "Design", "Other"] as const;

const statusHistorySchema = new Schema({
    status: { 
        type: String, 
        enum: STATUSES, 
        required: true 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedBy: { 
        type: String, 
        enum: ["manual", "gmail"], 
        default: "manual" 
    }
}, { _id: false }); // _id false rakha hai taaki har history entry ki alag ID na bane

// 3. Main Application Schema
export const applicationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        index: true, // Fast query ke liye
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: STATUSES,
        default: "Applied",
    },
    source: {
        type: String,
        enum: SOURCES,
    },
    track: {
        type: String,
        enum: TRACKS,
    },
    // Date aur extra fields
    appliedAt: { 
        type: Date, 
        default: Date.now 
    },
    followUpAt: { 
        type: Date 
    },
    deadlineAt: { 
        type: Date 
    },
    resumeVersion: { 
        type: String 
    },
    contact: { 
        type: String 
    },
    jobUrl: { 
        type: String 
    },
    notes: { 
        type: String 
    },
    
    // Kanban board ke liye sorting position
    position: { 
        type: Number, 
        required: true 
    },
    
    statusHistory: [statusHistorySchema],
    
    // Future use (Gmail Phase)
    createdVia: { 
        type: String, 
        enum: ["manual", "gmail"], 
        default: "manual" 
    },
    gmailThreadId: { 
        type: String, 
        default: null 
    }
}, { timestamps: true });

// 4. Database Indexes (Sabse Important)
// Ye queries ko 10x fast karega
applicationSchema.index({ userId: 1, status: 1, position: 1 });
applicationSchema.index({ userId: 1, appliedAt: -1 });

// 5. Model Export
export const Application = model("Application", applicationSchema);