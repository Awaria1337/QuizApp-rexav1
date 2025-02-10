import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: 'success', message: 'MongoDB bağlantısı başarılı!' });
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}