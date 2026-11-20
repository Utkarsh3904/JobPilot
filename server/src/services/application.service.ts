import { STATUSES, SOURCES, TRACKS, Application } from "../models/application.model";

export async function createApplication(userId:string, data:any){
    const status = data.status ?? "APPLIED";

    const lastApp = await Application.findOne({ userId, status }).sort({ position: -1 });

    let position;
    if(lastApp){
        position = lastApp.position + 1;
    }else{
        position = 1;
    }

    const newApp = await Application.create({
        ...data,
        userId,
        status,
        position,
        statusHistory: [{status, updatedBy: "manual"}]
    }); 

    return newApp;
}

// Search text ko safe banane ke liye (hacker regex me kachra na bhej de)
const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function listApplications(userId: string, query: any) {
    // 1. Khali filter banao aur userId daalo
    const filter: any = { userId };

    // 2. Jo filters aaye hain unhe add karo (jaise status, source, track)
    if (query.status) filter.status = query.status;
    if (query.source) filter.source = query.source;
    if (query.track) filter.track = query.track;

    // 3. Search lagao (agar user ne kuch search kiya hai toh)
    if (query.search) {
        const regex = new RegExp(escapeRegex(query.search), "i"); // "i" matlab case-insensitive
        filter.$or = [{ company: regex }, { role: regex }];
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const data = await Application.find(filter)
        .sort({ appliedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);


    const total = await Application.countDocuments(filter);

    return { data, total, page, limit};
}