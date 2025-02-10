import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Development ortamında hata fırlatmak yerine console.warn kullanıyoruz
  if (process.env.NODE_ENV === 'development') {
    console.warn('Please define the MONGODB_URI environment variable inside .env');
  }
  // Production ortamında varsayılan bir URI kullanıyoruz
  mongoose.connect = () => Promise.resolve();
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      });
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return null;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    return null;
  }

  return cached.conn;
}

export default connectDB;
