import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ders adı zorunludur'],
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori zorunludur'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

export default Lesson;
