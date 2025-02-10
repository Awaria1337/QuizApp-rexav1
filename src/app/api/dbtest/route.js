import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../lib/mongodb';

export async function GET() {
  try {
    // Mevcut bağlantıyı kontrol et
    console.log('Mevcut bağlantı durumu:', mongoose.connection.readyState);
    
    // Yeni bağlantı dene
    const db = await connectDB();
    console.log('Bağlantı başarılı');
    
    // Veritabanı listesini al
    const admin = db.connection.db.admin();
    const dbList = await admin.listDatabases();
    console.log('Veritabanları:', dbList);
    
    // Koleksiyonları listele
    const collections = await db.connection.db.listCollections().toArray();
    console.log('Koleksiyonlar:', collections);
    
    return NextResponse.json({
      connectionState: mongoose.connection.readyState,
      databases: dbList,
      collections: collections,
      uri: process.env.MONGODB_URI ? 'URI tanımlı' : 'URI tanımlı değil'
    });
  } catch (error) {
    console.error('Test hatası:', error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
