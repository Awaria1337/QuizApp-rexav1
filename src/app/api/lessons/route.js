import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lesson from '@/models/Lesson';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    let query = {};
    if (categoryId) query.category = categoryId;

    const lessons = await Lesson.find(query)
      .populate('category')
      .sort({ createdAt: -1 });

    return NextResponse.json(lessons);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, category } = await request.json();
    await connectDB();
    
    const lesson = await Lesson.create({
      name,
      description,
      category,
    });
    
    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
