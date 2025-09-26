import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    classroom_id: { type: String, required: true },
    question: { type: String, required: true },
    status: { type: String, enum: ["unanswered", "answered", "important"], default: "unanswered" },
    author: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Question", questionSchema);