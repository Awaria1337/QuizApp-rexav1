import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Soru metni zorunludur'],
    trim: true
  },
  options: [{
    type: String,
    required: [true, 'Seçenekler zorunludur'],
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: [true, 'Doğru cevap zorunludur'],
    min: 0
  },
  explanation: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori zorunludur'],
    index: true
  },
  status: {
    type: Boolean,
    default: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['Kolay', 'Orta', 'Zor'],
    default: 'Orta',
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Performans için indexler
questionSchema.index({ category: 1, status: 1 });
questionSchema.index({ createdAt: -1 });

const Question = mongoose.models?.Question || mongoose.model('Question', questionSchema);

export default Question;
