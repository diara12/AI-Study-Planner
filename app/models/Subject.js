import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    examDate: {
        type: Date,
        required: true
    },
    studyHoursPerDay: {
        type: Number,
        required: true
    },
    topics: [{
        name: String,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);