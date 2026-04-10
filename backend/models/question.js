import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }], // e.g ["A", "B", "C", "D"]
    correctAnswer: {type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);