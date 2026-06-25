import mongoose from "mongoose";

interface IVisitor {
    fingerprint: string,
    firstSeen: Date,
    lastSeen: Date,
    totalSessions: number,
    country: string,
    device: 'mobile' | 'desktop' | 'tablet' | 'other'
}

interface ISession {
    sessionId: string,
    visitorId: mongoose.Types.ObjectId,
    startedAt: Date,
    lastActiveAt: Date,
    duration: number,
    pagesViewed: string[],
    referrer?: string,
    userAgent?: string
}

interface IPageview {
    sessionId: string,
    section: string,
    timestamp: Date,
    timeSpent: number
}

const visitorSchema = new mongoose.Schema<IVisitor>({
    fingerprint: {
        type: String,
        required: true,
        unique: true
    },
    firstSeen: {
        type: Date,
        required: true
    },
    lastSeen: {
        type: Date,
        required: true
    },
    totalSessions: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    device: {
        type: String,
        enum: ["mobile", "desktop", "tablet", "other"],
        default: "desktop"
    }
})

const sessionSchema = new mongoose.Schema<ISession>({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    visitorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visitor",
        required: true
    },
    startedAt: {
        type: Date,
        required: true
    },
    lastActiveAt: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        default: 0
    },
    pagesViewed: {
        type: [String],
        required: true
    },
    referrer: {
        type: String
    },
    userAgent: {
        type: String
    }
})

const pageviewSchema = new mongoose.Schema<IPageview>({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    section: {
        type: String,
        required: true,
        enum: ['hero', 'about', 'experience', 'projects', 
           'research', 'certifications', 'skills', 
           'coding', 'contact']
    },
    timestamp: {
        type: Date,
    },
    timeSpent: {
        type: Number
    }
});

sessionSchema.index({visitorId: 1});
sessionSchema.index({startedAt: -1});
pageviewSchema.index({timestamp: 1}, {expireAfterSeconds: 7776000});
pageviewSchema.index({section: 1});

export const Visitor = mongoose.model<IVisitor>('Visitor', visitorSchema);
export const Session = mongoose.model<ISession>('Sesson', sessionSchema);
export const Pageview = mongoose.model<IPageview>('Pageview', pageviewSchema);