import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Achievement şeması
const achievementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['quiz_master', 'streak_champion', 'category_expert'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: {
      type: String,
      enum: ['quiz_complete', 'correct_answers', 'streak', 'category_complete'],
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false
    }
  },
  rewards: {
    xp: { type: Number, required: true },
    gems: { type: Number, default: 0 },
    hearts: { type: Number, default: 0 },
    icon: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Model oluştur
const Achievement = mongoose.models?.Achievement || mongoose.model('Achievement', achievementSchema);

export async function GET() {
  try {
    await connectDB();
    const achievements = await Achievement.find({}).sort({ createdAt: -1 });
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Başarılar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();
    const achievement = await Achievement.create(data);
    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { error: 'Başarı eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    await connectDB();
    const achievement = await Achievement.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return NextResponse.json(
        { error: 'Başarı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { error: 'Başarı güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await connectDB();
    const achievement = await Achievement.findByIdAndDelete(id);

    if (!achievement) {
      return NextResponse.json(
        { error: 'Başarı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Başarı başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { error: 'Başarı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}