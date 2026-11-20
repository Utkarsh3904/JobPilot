import { Schema, model } from 'mongoose';

// 1. Enums (Fixed Options)
export const STATUSES = ["Applied", "Interviewing", "Offered", "Rejected"] as const;
export const SOURCES = ["LinkedIn", "Naukri", "Internshala", "Unstop", "Company Portal", "HR Email", "Other"] as const;
export const TRACKS = ["Full Stack", "Backend", "Frontend", "Software Development", "Other"] as const;

// 2. Status History Schema (Har change ka record)
const statusHistorySchema = new Schema({
    status: {
        type: String,
        enum: STATUSES,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: String,
        enum: ["manual", "gmail"],
        default: "manual",
    }
}, { _id: false }); // _id: false taaki har history item ka alag ID na bane

// 3. Main
const applicationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true,
        index: true, // Fast search
    },
    company: {
        type: String,
        required: true,
        trim: true, // Aage-piche ki space hata dega
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
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    followUpAt: {
        type: Date,
    },
    deadlineAt: {
        type: Date,
    },
    resumeVersion: {
        type: String,
    },
    contact: {
        type: String,
    },
    jobUrl: {
        type: String,
    },
    notes: {
        type: String,
    },
    position: {
        type: Number,
        required: true, // Kanban me card ki position (1, 2, 3...)
    },
    statusHistory: [statusHistorySchema], // Array of history
    createdVia: {
        type: String,
        enum: ["manual", "gmail"],
        default: "manual",
    },
    gmailThreadId: {
        type: String,
        // Dhyan rakhna: default null MAT dena, warna unique index me clash hoga
    }
}, { timestamps: true }); // createdAt aur updatedAt automatic 

// 4. Indexes (Database ko fast karne ke liye)
applicationSchema.index({ userId: 1, status: 1, position: 1 }); // Kanban board fetch karne ke liye
applicationSchema.index({ userId: 1, appliedAt: -1 }); // Table view ke liye (latest first)
applicationSchema.index(
    { userId: 1, gmailThreadId: 1 },
    { 
        unique: true, 
        partialFilterExpression: { gmailThreadId: { $type: "string" } } 
    }
); // Gmail sync ke liye (null values clash nahi karengi)

export const Application = model("Application", applicationSchema);