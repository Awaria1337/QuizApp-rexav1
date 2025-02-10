import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Question from '../../../../models/Question';
import Category from '../../../../models/Category';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Kategori ID\'si gerekli' },
        { status: 400 }
      );
    }

    await connectDB();

    // Önce kategorinin var olduğunu kontrol et
    const category = await Category.findById(categoryId).lean();
    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Kategorideki toplam soru sayısını bul
    const count = await Question.countDocuments({ 
      category: categoryId,
      status: true 
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Soru sayısı alınırken hata:', error);
    return NextResponse.json(
      { error: error.message || 'Soru sayısı alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}