import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ShopItem from '@/models/ShopItem';

export async function GET() {
    try {
        await connectDB();
        const items = await ShopItem.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        await connectDB();
        const item = await ShopItem.create(data);
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();
        const { id, ...updateData } = data;
        
        await connectDB();
        const item = await ShopItem.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        await connectDB();
        await ShopItem.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Shop item deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}