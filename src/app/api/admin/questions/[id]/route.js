import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const question = await Question.findById(params.id);
    
    if (!question) {
      return NextResponse.json(
        { error: 'Soru bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Soru alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const question = await Question.findById(params.id);
    
    if (!question) {
      return NextResponse.json(
        { error: 'Soru bulunamadı' },
        { status: 404 }
      );
    }

    await question.deleteOne();
    return NextResponse.json({ message: 'Soru başarıyla silindi' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Soru silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    await connectDB();
    
    const question = await Question.findByIdAndUpdate(
      params.id,
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

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Soru güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}