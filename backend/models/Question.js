import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    classroom_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    question: { type: String, required: true },
    status: { type: String, enum: ["unanswered", "answered", "important"], default: "unanswered" },
    author: { type: String, required: true },
    color: { type: String, default: "yellow" },
    category: { type: String, default: "general" },
    timestamp: { type: Date, default: Date.now },
    // TA answer fields
    taAnswer: {
        answer: { type: String },
        answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'TeachingAssistant' },
        answeredAt: { type: Date },
        attachments: [{
            filename: { type: String },
            originalName: { type: String },
            path: { type: String },
            size: { type: Number },
            uploadedAt: { type: Date, default: Date.now }
        }]
    }
});

export default mongoose.model("Question", questionSchema);