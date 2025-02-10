import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Question from '../../../models/Question';
import Category from '../../../models/Category';
import { Types } from 'mongoose';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const id = searchParams.get('id');
    const count = parseInt(searchParams.get('count')) || 10;
    const random = searchParams.get('random') === 'true';

    await connectDB();

    // Tek bir soru getir
    if (id) {
      const question = await Question.findById(id).lean();
      if (!question) {
        return NextResponse.json(
          { error: 'Soru bulunamadı' },
          { status: 404 }
        );
      }
      return NextResponse.json(question);
    }

    // Kategoriye göre soru getir
    if (categoryId) {
      // Kategori kontrolü
      const category = await Category.findById(categoryId).lean();
      if (!category) {
        return NextResponse.json(
          { error: 'Kategori bulunamadı' },
          { status: 404 }
        );
      }

      let query = Question.find({ category: categoryId });

      // Quiz için rastgele soru getir
      if (random) {
        const questions = await Question.aggregate([
          { $match: { category: new Types.ObjectId(categoryId), status: true } },
          { $sample: { size: count } }
        ]);

        if (questions.length === 0) {
          return NextResponse.json(
            { error: 'Bu kategoride soru bulunamadı' },
            { status: 404 }
          );
        }

        return NextResponse.json(questions);
      }

      // Admin paneli için tüm soruları getir
      const questions = await query.lean();
      return NextResponse.json(questions);
    }

    // Tüm soruları getir
    const questions = await Question.find().lean();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Sorular alınırken hata:', error);
    return NextResponse.json(
      { error: error.message || 'Sorular alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    await connectDB();

    // Kategori kontrolü
    const category = await Category.findById(body.category).lean();
    if (!category) {
      return NextResponse.json(
        { error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }

    // Yeni soruyu oluştur
    const question = new Question({
      question: body.question,
      options: body.options,
      correctAnswer: body.correctAnswer,
      category: body.category,
      difficulty: body.difficulty || 'Orta',
      status: true
    });

    await question.validate(); // Validasyon kontrolü
    const savedQuestion = await question.save();
    console.log('Soru kaydedildi:', savedQuestion);

    return NextResponse.json(savedQuestion, { status: 201 });
  } catch (error) {
    console.error('Soru oluşturma hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Soru eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Soru ID\'si gerekli' },
        { status: 400 }
      );
    }

    await connectDB();

    // Kategori kontrolü
    const category = await Category.findById(body.category).lean();
    if (!category) {
      return NextResponse.json(
        { error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }

    // Soruyu güncelle
    const question = await Question.findByIdAndUpdate(
      id,
      {
        question: body.question,
        options: body.options,
        correctAnswer: body.correctAnswer,
        category: body.category,
        difficulty: body.difficulty || 'Orta',
      },
      { new: true, runValidators: true }
    );

    if (!question) {
      return NextResponse.json(
        { error: 'Soru bulunamadı' },
        { status: 404 }
      );
    }

    console.log('Soru güncellendi:', question);
    return NextResponse.json(question);
  } catch (error) {
    console.error('Soru güncelleme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Soru güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Soru ID\'si gerekli' },
        { status: 400 }
      );
    }

    await connectDB();

    const question = await Question.findById(id);
    if (!question) {
      return NextResponse.json(
        { error: 'Soru bulunamadı' },
        { status: 404 }
      );
    }

    await question.deleteOne();
    console.log('Soru silindi:', id);

    return NextResponse.json({ message: 'Soru başarıyla silindi' });
  } catch (error) {
    console.error('Soru silme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Soru silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}