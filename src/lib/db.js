import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      return mongoose.connection;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    throw error;
  }
}