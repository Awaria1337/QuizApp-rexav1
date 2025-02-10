import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Category from '../../../models/Category';
import Question from '../../../models/Question';

export async function POST(request) {
  try {
    await connectDB();

    // Tüm koleksiyonları temizle
    await Category.deleteMany({});
    await Question.deleteMany({});

    // Indexleri yeniden oluştur
    await Category.syncIndexes();
    await Question.syncIndexes();

    return NextResponse.json({ message: 'Veritabanı başarıyla sıfırlandı' });
  } catch (error) {
    console.error('Veritabanı sıfırlama hatası:', error);
    return NextResponse.json(
      { error: 'Veritabanı sıfırlanırken bir hata oluştu' },
      { status: 500 }
    );
  }
}
