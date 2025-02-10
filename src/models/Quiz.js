import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide a question'],
  },
  options: [{
    type: String,
    required: [true, 'Please provide options'],
  }],
  correctAnswer: {
    type: String,
    required: [true, 'Please provide the correct answer'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
s