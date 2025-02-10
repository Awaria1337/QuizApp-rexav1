import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const query = categoryId ? { category: categoryId } : {};
    const questions = await Question.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();
    
    const question = await Question.create({
      question: data.text,
      options: data.options,
      correctAnswer: data.correctAnswer,
      category: data.categoryId,
      difficulty: data.difficulty || 'Orta'
    });
    
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}