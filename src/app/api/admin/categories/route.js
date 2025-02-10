import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({});
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Kategoriler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json(
        { message: 'Kategori adı zorunludur' },
        { status: 400 }
      );
    }

    const category = await Category.create(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: 'Kategori eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}