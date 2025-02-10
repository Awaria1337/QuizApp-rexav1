import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kategori adı zorunludur'],
    trim: true
  },
  slug: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

// Kategori adından otomatik slug oluştur
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    // Özel karakterleri ve boşlukları temizle
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Define indexes once
categorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ status: 1 });
categorySchema.index({ order: 1, name: 1 });

const Category = mongoose.models?.Category || mongoose.model('Category', categorySchema);

export default Category;
